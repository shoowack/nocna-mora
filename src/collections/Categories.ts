import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, anyone } from '@/access'
import { populateSlug } from '@/hooks/populateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      label: 'Naziv',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [populateSlug('title')],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
  ],
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
}
