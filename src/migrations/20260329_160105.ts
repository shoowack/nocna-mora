import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_participants_gender" ADD VALUE 'transgender' BEFORE 'other';
  ALTER TABLE "participants" ALTER COLUMN "gender" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_text" SET DATA TYPE varchar;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "participant_seo_title_template" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "participant_seo_description_template" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_message" varchar;
  ALTER TABLE "participants" DROP COLUMN "meta_title";
  ALTER TABLE "participants" DROP COLUMN "meta_description";
  ALTER TABLE "timeline_events" DROP COLUMN "importance";
  DROP TYPE "public"."enum_timeline_events_importance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_timeline_events_importance" AS ENUM('low', 'medium', 'high');
  ALTER TABLE "participants" ALTER COLUMN "gender" SET DATA TYPE text;
  DROP TYPE "public"."enum_participants_gender";
  CREATE TYPE "public"."enum_participants_gender" AS ENUM('male', 'female', 'other');
  ALTER TABLE "participants" ALTER COLUMN "gender" SET DATA TYPE "public"."enum_participants_gender" USING "gender"::"public"."enum_participants_gender";
  ALTER TABLE "participants" ALTER COLUMN "gender" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_text" SET DATA TYPE jsonb;
  ALTER TABLE "participants" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "participants" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "timeline_events" ADD COLUMN "importance" "enum_timeline_events_importance" DEFAULT 'medium';
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "site_settings" DROP COLUMN "participant_seo_title_template";
  ALTER TABLE "site_settings" DROP COLUMN "participant_seo_description_template";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_message";`)
}
