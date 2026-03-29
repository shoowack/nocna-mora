import Link from "next/link";
import Image from "next/image";
import { Baby, Skull, Youtube, Play, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineEvent = {
  id: string;
  title: string;
  description?: { root: unknown } | null;
  eventDate: string;
  image?: { url: string; alt: string; credit?: string | null } | null;
  relatedVideo?: { slug: string; title: string } | null;
  category?: "birth" | "death" | "aired" | "event";
  link?: { href: string; label: string } | null;
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative space-y-8 py-10 before:absolute before:inset-0 before:ml-5 before:h-full before:w-1 before:-translate-x-px before:bg-[linear-gradient(to_bottom,transparent_0px,rgb(240_240_240)_30px,rgb(240_240_240)_calc(100%-30px),transparent_100%)] dark:before:bg-[linear-gradient(to_bottom,transparent_0px,rgb(30_30_30)_30px,rgb(30_30_30)_calc(100%-30px),transparent_100%)] md:before:mx-auto md:before:translate-x-0">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
        >
          {/* Icon */}
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full ring-4 ring-background bg-muted text-stone-500 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
              {
                "": event.category === "death",
                "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200":
                  event.category === "birth",
                "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200":
                  event.category === "aired",
              },
            )}
          >
            {event.category === "birth" ? (
              <Baby className="size-5" strokeWidth={2} />
            ) : event.category === "death" ? (
              <Skull className="size-5" strokeWidth={2} />
            ) : event.category === "aired" ? (
              <Youtube className="size-5" strokeWidth={2} />
            ) : (
              <CalendarDays className="size-5" strokeWidth={2} />
            )}
          </div>

          {/* Card */}
          <div
            className={cn(
              "w-[calc(100%-4rem)] rounded-xl p-4 md:w-[calc(50%-2.5rem)] relative border bg-muted dark:bg-muted dark:border-muted-foreground/20 border-muted-foreground/30",
              {
                "": event.category === "death",
                "bg-blue-100/50 text-blue-800 dark:bg-blue-950/50 dark:border-blue-950 border-blue-200":
                  event.category === "birth",
                "bg-red-100/50 text-red-800 dark:bg-red-950/50 dark:border-red-950 border-red-200":
                  event.category === "aired",
              },
            )}
          >
            <div className="mb-1 flex flex-col items-start justify-between md:flex-row md:space-x-2">
              {event.title && (
                <div className="font-bold text-foreground">{event.title}</div>
              )}
              {event.eventDate && (
                <time className="mt-1.5 whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(event.eventDate).toLocaleString("hr-HR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>

            <div className="text-muted-foreground">
              {event.image && (
                <div className="mb-3">
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <Image
                      src={event.image.url}
                      alt={event.image.alt || event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {event.image.credit && (
                    <p className="mt-1 text-center text-xs text-muted-foreground">
                      © {event.image.credit}
                    </p>
                  )}
                </div>
              )}

              {event.category === "aired" && event.link ? (
                <Link
                  href={event.link.href}
                  className="mt-2 inline-flex items-center rounded-md bg-stone-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
                >
                  <Play className="mr-2 size-3.5" />
                  Video
                </Link>
              ) : event.link ? (
                <Link
                  href={event.link.href}
                  className="mt-2 inline-block text-sm hover:underline"
                >
                  {event.link.label}
                </Link>
              ) : event.relatedVideo ? (
                <Link
                  href={`/video/${event.relatedVideo.slug}`}
                  className="mt-2 inline-flex items-center rounded-md bg-stone-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
                >
                  <Play className="mr-2 size-3.5" />
                  Video
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
