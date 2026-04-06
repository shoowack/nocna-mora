import type { CollectionConfig } from "payload"
import { anyone, isAdmin, isAdminOrEditor } from "@/access"

export const TimelineEvents: CollectionConfig = {
  slug: "timeline-events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eventDate"]
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Naslov"
    },
    {
      name: "description",
      type: "richText",
      label: "Opis"
    },
    {
      name: "eventDate",
      type: "date",
      required: true,
      label: "Datum događaja",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd.MM.yyyy"
        }
      }
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Slika"
    },
    {
      name: "relatedVideo",
      type: "relationship",
      relationTo: "videos",
      label: "Povezani video"
    }
  ],
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin
  }
}
