import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Postavke stranice',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'TV Arhiv',
      label: 'Naziv stranice',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Opis stranice',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Društvene mreže',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta naslov',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta opis',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG slika',
        },
      ],
    },
    {
      name: 'footerText',
      type: 'richText',
      label: 'Tekst podnožja',
    },
  ],
}
