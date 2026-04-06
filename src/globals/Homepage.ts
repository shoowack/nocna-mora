import type { GlobalConfig } from "payload"
import { anyone, isAdmin } from "@/access"

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Početna stranica",
  access: {
    read: anyone,
    update: isAdmin
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      label: "Naslov"
    },
    {
      name: "heroDescription",
      type: "richText",
      label: "Opis"
    },
    {
      name: "featuredVideos",
      type: "relationship",
      relationTo: "videos",
      hasMany: true,
      label: "Istaknuti videi"
    },
    {
      name: "featuredParticipants",
      type: "relationship",
      relationTo: "participants",
      hasMany: true,
      label: "Istaknuti sudionici"
    }
  ]
}
