import type { CollectionConfig } from "payload"
import { isAdmin, isAdminOrEditor, notArchived } from "@/access"
import { populateSlug } from "@/hooks/populateSlug"

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "deletedAt"]
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      unique: true,
      label: "Naziv"
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar"
      },
      hooks: {
        beforeValidate: [populateSlug("title")]
      }
    },
    {
      name: "description",
      type: "textarea",
      label: "Opis"
    },
    {
      name: "deletedAt",
      type: "date",
      label: "Arhivirano",
      admin: {
        position: "sidebar",
        description: "Postavi datum za arhiviranje (sakriva od javnosti)",
        date: {
          pickerAppearance: "dayAndTime"
        }
      }
    }
  ],
  access: {
    read: notArchived,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin
  }
}
