import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "participants" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DROP COLUMN "deleted_at";
  ALTER TABLE "participants" DROP COLUMN "deleted_at";
  ALTER TABLE "categories" DROP COLUMN "deleted_at";
  ALTER TABLE "comments" DROP COLUMN "deleted_at";`)
}
