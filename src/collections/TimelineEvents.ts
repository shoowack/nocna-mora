import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, anyone } from '@/access'

export const TimelineEvents: CollectionConfig = {
  slug: 'timeline-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'importance'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Naslov',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Datum događaja',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika',
    },
    {
      name: 'relatedVideo',
      type: 'relationship',
      relationTo: 'videos',
      label: 'Povezani video',
    },
    {
      name: 'importance',
      type: 'select',
      defaultValue: 'medium',
      label: 'Važnost',
      options: [
        { label: 'Niska', value: 'low' },
        { label: 'Srednja', value: 'medium' },
        { label: 'Visoka', value: 'high' },
      ],
    },
  ],
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
}
