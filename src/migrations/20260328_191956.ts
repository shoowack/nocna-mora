import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "participants" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "participants" ADD COLUMN "meta_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "participants" DROP COLUMN "meta_title";
  ALTER TABLE "participants" DROP COLUMN "meta_description";`)
}
