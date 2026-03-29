import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "@/lib/payload";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Bell, User } from "lucide-react";
import type { Media } from "../../../../payload-types";

export const metadata = {
  title: "Profil | Noćna mora Željka Malnara",
};

export default async function ProfilePage() {
  const payload = await getPayload();
  const headersList = await headers();

  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    redirect("/prijava");
  }

  const fullUser = await payload.findByID({ collection: "users", id: user.id, depth: 1 });
  const avatarUrl = (fullUser?.avatar as Media | null | undefined)?.url ?? undefined;

  // Fetch unread notifications
  const notifications = await payload.find({
    collection: "notifications",
    where: {
      and: [{ recipient: { equals: user.id } }, { read: { equals: false } }],
    },
    sort: "-createdAt",
    limit: 20,
    depth: 1,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={user.name} fill className="object-cover" sizes="64px" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Obavijesti ({notifications.totalDocs})
          </h2>
        </div>

        {notifications.docs.length === 0 ? (
          <p className="text-muted-foreground">Nema novih obavijesti.</p>
        ) : (
          <div className="space-y-3">
            {notifications.docs.map((notif: any) => (
              <div
                key={notif.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {notif.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notif.createdAt)}
                  </span>
                </div>
                {notif.relatedVideo &&
                  typeof notif.relatedVideo === "object" && (
                    <Link
                      href={`/video/${notif.relatedVideo.slug}`}
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Pogledaj video
                    </Link>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
