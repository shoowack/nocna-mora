import type { CollectionConfig } from "payload"
import { anyone, isAdmin, isAdminOrSelf } from "@/access"

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000 // 10 minutes in ms
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "user",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "User", value: "user" }
      ],
      access: {
        update: ({ req: { user } }) => user?.role === "admin"
      },
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "notifyNewVideos",
      type: "checkbox",
      defaultValue: true,
      label: "Obavijesti me o novim videima",
      admin: {
        description: "Primaj email obavijesti kada se doda novi video"
      }
    }
  ],
  access: {
    read: anyone,
    create: anyone,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor"
  }
}
