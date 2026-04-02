import type { FieldHook } from 'payload'

export const populateSlug =
  (sourceField: string): FieldHook =>
  ({ data, originalDoc, value }) => {
    if (value) return value

    const source = data?.[sourceField] || originalDoc?.[sourceField]
    if (!source) return value

    return source
      .toString()
      .toLowerCase()
      .replace(/č/g, 'c')
      .replace(/ć/g, 'c')
      .replace(/đ/g, 'd')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

export const populateFullName: FieldHook = ({ data, originalDoc }) => {
  const firstName = data?.firstName || originalDoc?.firstName || ''
  const lastName = data?.lastName || originalDoc?.lastName || ''
  return `${firstName} ${lastName}`.trim()
}

export const populateParticipantSlug: FieldHook = ({ data, originalDoc, value }) => {
  if (value) return value

  const firstName = data?.firstName || originalDoc?.firstName || ''
  const lastName = data?.lastName || originalDoc?.lastName || ''
  const full = `${firstName} ${lastName}`.trim()

  if (!full) return value

  return full
    .toLowerCase()
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/đ/g, 'd')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
