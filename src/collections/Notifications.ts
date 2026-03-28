import type { CollectionConfig } from 'payload'
import { isAdmin, isRecipientOrAdmin } from '@/access'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    defaultColumns: ['title', 'type', 'recipient', 'read', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Naslov',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Poruka',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tip',
      options: [
        { label: 'Novi video', value: 'new_video' },
        { label: 'Odgovor na komentar', value: 'comment_reply' },
        { label: 'Sustav', value: 'system' },
      ],
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      label: 'Primatelj',
    },
    {
      name: 'relatedVideo',
      type: 'relationship',
      relationTo: 'videos',
      label: 'Povezani video',
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      label: 'Pročitano',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Email poslan',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  access: {
    read: isRecipientOrAdmin,
    create: isAdmin,
    update: isRecipientOrAdmin,
    delete: isAdmin,
  },
}
