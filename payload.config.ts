import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import {
  Users,
  Media,
  Videos,
  Participants,
  Categories,
  Comments,
  Reactions,
  TimelineEvents,
  Notifications,
} from "@/collections";
import { migrations } from "@/migrations";
import { SiteSettings } from "@/globals/SiteSettings";
import { Homepage } from "@/globals/Homepage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "Admin | Noćna mora Željka Malnara",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Videos,
    Participants,
    Categories,
    Comments,
    Reactions,
    TimelineEvents,
    Notifications,
  ],
  globals: [SiteSettings, Homepage],
  plugins: [
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
              },
              region: "auto",
              endpoint: process.env.R2_ENDPOINT,
            },
          }),
        ]
      : []),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    prodMigrations: migrations,
    push: process.env.DB_PUSH === 'true',
  }),
  editor: lexicalEditor(),
  email: process.env.RESEND_API_KEY
    ? undefined // Configure @payloadcms/email-resend when API key is available
    : undefined,
  secret: process.env.PAYLOAD_SECRET || "CHANGE-ME-IN-PRODUCTION",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
