import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'editor') return true
  return { published: { equals: true } }
}

export const approvedOrAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true
  return { approved: { equals: true } }
}

export const isRecipientOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { recipient: { equals: user.id } }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const anyone: Access = () => true
