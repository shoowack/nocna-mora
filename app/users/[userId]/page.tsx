import { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  Contact2,
  LucideIcon,
  Mail,
  UserCircle2,
} from "lucide-react";
import { AuditLogSection } from "@/components/audit-log-section";
import { TitleTemplate } from "@/components/title-template";
import { formatDate } from "@/lib/date";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  if (!session?.user || (userId !== session?.user?.id && !isAdmin)) {
    redirect("/access-denied");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      image: true,
      role: true,
    },
  });

  const logs = await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/users");
  }

  // Check if user had any activity in the last 1 day
  const activity = await prisma.auditLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    },
  });

  const getUserDetails = (
    key: string,
    value: string | null | Date | ReactNode,
  ): [string, LucideIcon, string] => {
    switch (key) {
      case "id":
        return ["ID", UserCircle2, value as string];
      case "email":
        return ["Email", Mail as LucideIcon, value as string];
      case "role":
        return [
          "Uloga",
          Contact2 as LucideIcon,
          value === "admin" ? "Administrator" : "Korisnik",
        ];
      case "createdAt":
        return ["Datum kreiranja", CalendarDays, formatDate(value as Date)];
      case "updatedAt":
        return [
          "Datum posljednje promjene",
          CalendarDays,
          formatDate(value as Date),
        ];
      default:
        return ["", UserCircle2, "N/A"];
    }
  };

  return (
    <TitleTemplate
      title="Detalji korisnika"
      description="Pregled i upravljanje detaljima korisnika"
      contained
      {...(isAdmin && {
        button: (
          <Link href={`/users/`}>
            <Button className="w-full">
              <ChevronLeft />
              Natrag na korisnike
            </Button>
          </Link>
        ),
      })}
      containedClassNames="space-y-24"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-x-4">
          <Image
            src={
              user.image ??
              `https://api.dicebear.com/9.x/thumbs/svg?seed=${
                Math.floor(Math.random() * 100000) + 1
              }&randomizeIds=true`
            }
            width={100}
            height={100}
            alt={user.name ?? user.email ?? "Korisnička slika"}
            className="size-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{user.name || "N/A"}</h1>
            <p className="text-sm text-gray-500">
              {activity.length ? "Aktivan" : "Neaktivan"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3">
          {Object.entries(user)
            .filter(
              ([key]) =>
                key === "id" ||
                key === "email" ||
                key === "role" ||
                key === "createdAt" ||
                key === "updatedAt",
            )
            .map(([key, value]) => {
              const [label, Icon, formattedValue] = getUserDetails(key, value);

              return (
                <div className="flex" key={key}>
                  <label className="flex min-w-64 items-center gap-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <Icon className="size-4 min-w-4 stroke-gray-400" />
                    {label}
                  </label>
                  {value === "admin" || value === "user" ? (
                    <Badge variant={value === "admin" ? "default" : "outline"}>
                      {formattedValue}
                    </Badge>
                  ) : (
                    <p className="text-sm text-gray-500">{formattedValue}</p>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <AuditLogSection logs={logs} />
    </TitleTemplate>
  );
}
