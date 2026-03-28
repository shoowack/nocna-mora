-- Enable extensions for full-text search and fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create a Croatian-friendly text search configuration
-- Uses 'simple' tokenizer + unaccent filter to handle Croatian diacritics (č, ć, đ, š, ž)
CREATE TEXT SEARCH CONFIGURATION croatian (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION croatian
  ALTER MAPPING FOR asciiword, word, numword, asciihword, hword, numhword
  WITH unaccent, simple;
