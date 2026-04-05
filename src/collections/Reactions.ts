import type { CollectionConfig } from 'payload'
import { anyone, isAuthenticated } from '@/access'

export const Reactions: CollectionConfig = {
  slug: 'reactions',
  admin: {
    defaultColumns: ['type', 'video', 'user', 'createdAt'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tip',
      options: [
        { label: '👍 Sviđa mi se', value: 'like' },
        { label: '❤️ Obožavam', value: 'love' },
        { label: '😂 Smiješno', value: 'laugh' },
        { label: '😮 Wow', value: 'wow' },
        { label: '😢 Tužno', value: 'sad' },
        { label: '😡 Ljuto', value: 'angry' },
      ],
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  access: {
    read: anyone,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
}
