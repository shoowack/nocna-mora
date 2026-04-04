import type { CollectionAfterChangeHook } from 'payload'

export const notifyUsersOnNewVideo: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger when a video is first published
  if (operation === 'update' && doc.published && !previousDoc?.published) {
    const payload = req.payload

    // Fire and forget — don't block the save response
    void (async () => {
      try {
        // Find users who opted in to notifications
        const subscribers = await payload.find({
          collection: 'users',
          where: { notifyNewVideos: { equals: true } },
          limit: 0,
        })

        for (const user of subscribers.docs) {
          // Create in-app notification
          await payload.create({
            collection: 'notifications',
            data: {
              title: 'Novi video!',
              message: `Dodan je novi video: ${doc.title}`,
              type: 'new_video',
              recipient: user.id,
              relatedVideo: doc.id,
            },
          })

          // Send email notification
          if (user.email) {
            try {
              await payload.sendEmail({
                to: user.email,
                subject: `Novi video: ${doc.title}`,
                html: `
                  <p>Pozdrav ${user.name || ''},</p>
                  <p>Dodan je novi video u arhiv: <strong>${doc.title}</strong></p>
                  <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/video/${doc.slug}">Pogledaj video</a></p>
                `,
              })
            } catch {
              console.error(`Failed to send email to ${user.email}`)
            }
          }
        }
      } catch (error) {
        console.error('Error sending notifications:', error)
      }
    })()
  }

  return doc
}
