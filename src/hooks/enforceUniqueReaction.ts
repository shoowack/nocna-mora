import type { CollectionBeforeChangeHook } from "payload"

/**
 * Enforces one reaction per user per video.
 * If a reaction already exists, updates it instead of creating a duplicate.
 */
export const enforceUniqueReaction: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req
}) => {
  if (operation !== "create") return data

  const existing = await req.payload.find({
    collection: "reactions",
    where: {
      and: [{ video: { equals: data.video } }, { user: { equals: data.user } }]
    },
    limit: 1
  })

  if (existing.docs.length > 0) {
    // Update the existing reaction instead
    await req.payload.update({
      collection: "reactions",
      id: existing.docs[0].id,
      data: { type: data.type }
    })

    // Throw to prevent creating a duplicate
    throw new Error("Reaction updated instead of creating duplicate")
  }

  return data
}
