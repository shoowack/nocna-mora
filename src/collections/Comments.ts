import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated, approvedOrAdmin } from '@/access'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    defaultColumns: ['content', 'video', 'author', 'approved', 'createdAt'],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 500,
      label: 'Sadržaj',
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      required: true,
      index: true,
      label: 'Video',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Autor',
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Odobreno',
      admin: {
        position: 'sidebar',
        description: 'Odobri komentar za prikaz na stranici',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
  access: {
    read: approvedOrAdmin,
    create: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
}
