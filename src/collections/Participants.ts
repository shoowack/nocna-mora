import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, anyone } from '@/access'
import { populateFullName, populateParticipantSlug } from '@/hooks/populateSlug'

export const Participants: CollectionConfig = {
  slug: 'participants',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'type', 'slug'],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Ime',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Prezime',
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
      hooks: {
        beforeValidate: [populateFullName],
      },
    },
    {
      name: 'nickname',
      type: 'text',
      label: 'Nadimak',
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
        beforeValidate: [populateParticipantSlug],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tip',
      options: [
        { label: 'Glumac / Stalna postava', value: 'main' },
        { label: 'Gost', value: 'guest' },
      ],
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Spol',
      options: [
        { label: 'Muški', value: 'male' },
        { label: 'Ženski', value: 'female' },
        { label: 'Ostalo', value: 'other' },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biografija',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografija',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Datum rođenja',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'deathDate',
      type: 'date',
      label: 'Datum smrti',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
  ],
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
}
