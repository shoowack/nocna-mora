import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, publishedOrAdmin } from '@/access'
import { extractPlainTextFromTranscription } from '@/hooks/extractPlainText'
import { notifyUsersOnNewVideo } from '@/hooks/notifyOnNewVideo'
import { populateSlug } from '@/hooks/populateSlug'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'provider',
      'videoType',
      'duration',
      'airedDate',
      'published',
      'deletedAt',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Naslov',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Automatski generiran iz naslova ako je prazan',
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
    {
      name: 'videoId',
      type: 'text',
      required: true,
      label: 'ID videa',
      admin: {
        description: 'ID videa na platformi (npr. YouTube video ID)',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Dailymotion', value: 'dailymotion' },
        { label: 'Facebook', value: 'facebook' },
      ],
    },
    {
      name: 'videoType',
      type: 'select',
      required: true,
      defaultValue: 'full',
      label: 'Tip videa',
      options: [
        { label: 'Cijela epizoda', value: 'full' },
        { label: 'Isječak', value: 'clip' },
      ],
    },
    {
      name: 'duration',
      type: 'number',
      min: 0,
      label: 'Trajanje',
      admin: {
        components: {
          Field: '@/components/admin/DurationField#DurationField',
          Cell: '@/components/admin/DurationCell#DurationCell',
        },
      },
    },
    {
      name: 'airedDate',
      type: 'date',
      label: 'Datum emitiranja',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Objavljeno na javnom dijelu stranice',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Sličica',
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'participants',
      hasMany: true,
      label: 'Sudionici',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Kategorije',
    },
    {
      name: 'transcription',
      type: 'richText',
      label: 'Transkripcija',
    },
    {
      name: 'transcriptionPlain',
      type: 'textarea',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'deletedAt',
      type: 'date',
      label: 'Arhivirano',
      admin: {
        position: 'sidebar',
        description: 'Postavi datum za arhiviranje (sakriva od javnosti)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [extractPlainTextFromTranscription],
    afterChange: [notifyUsersOnNewVideo],
  },
  access: {
    read: publishedOrAdmin,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
}
