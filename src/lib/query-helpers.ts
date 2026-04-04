export const notArchived = { deletedAt: { exists: false } }

// Returns an array suitable for spreading into an `and` clause.
// Admins see all videos; everyone else only sees published ones.
export const publishedFilter = (isAdmin: boolean): any[] =>
  isAdmin ? [] : [{ published: { equals: true } }]
