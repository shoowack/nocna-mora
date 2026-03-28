import type { CollectionConfig } from 'payload'
import { isAuthenticated, anyone } from '@/access'
import { enforceUniqueReaction } from '@/hooks/enforceUniqueReaction'

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
  hooks: {
    beforeChange: [enforceUniqueReaction],
  },
  access: {
    read: anyone,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
}
