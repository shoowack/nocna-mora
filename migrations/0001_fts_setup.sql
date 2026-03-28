-- Full-Text Search setup for TV Archive
-- Run this AFTER Payload has created its tables (after first `pnpm dev` or `pnpm build`)

-- Add tsvector column to videos table for combined search
ALTER TABLE videos ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate the search vector with weighted fields
-- A = title (highest priority), B = description, C = transcription
UPDATE videos SET search_vector =
  setweight(to_tsvector('croatian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('croatian', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('croatian', coalesce("transcription_plain", '')), 'C');

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_videos_search ON videos USING GIN(search_vector);

-- Trigger to auto-update search_vector on INSERT/UPDATE
CREATE OR REPLACE FUNCTION videos_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('croatian', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('croatian', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('croatian', coalesce(NEW."transcription_plain", '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_videos_search_vector ON videos;
CREATE TRIGGER trg_videos_search_vector
  BEFORE INSERT OR UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION videos_search_vector_update();

-- Trigram indexes for fuzzy/partial matching (autocomplete)
CREATE INDEX IF NOT EXISTS idx_videos_title_trgm ON videos USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_participants_name_trgm ON participants USING GIN(
  ("first_name" || ' ' || "last_name") gin_trgm_ops
);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_comments_video_approved ON comments(video_id, approved);
CREATE INDEX IF NOT EXISTS idx_reactions_video ON reactions(video_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON notifications(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_videos_aired_date ON videos(aired_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_timeline_events_date ON "timeline-events"(event_date);
