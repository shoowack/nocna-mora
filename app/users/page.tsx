import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/date";
import { AuditLogStats } from "@/components/audit-log-stats";
import { TitleTemplate } from "@/components/title-template";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { auth } from "auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/access-denied");
  }

  const [users, stats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            auditLogs: true,
            videos: true,
            comments: true,
          },
        },
      },
    }),
    prisma.auditLog.count(),
  ]);

  const userStats = users.map((user) => ({
    id: user.id,
    name: user.name || user.email || "Unknown",
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    activityCount: user._count.auditLogs,
    videosCreated: user._count.videos,
    commentsCount: user._count.comments,
  }));

  return (
    <TitleTemplate
      title="Korisnici"
      description="Upravljajte korisnicima i pregledajte njihove aktivnosti"
      contained
      containedClassNames="space-y-24"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ime</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Uloga</TableHead>
            <TableHead>Datum kreiranja</TableHead>
            <TableHead>Aktivnosti</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userStats.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="!py-2 px-4">
                <Link
                  href={`/users/${user.id}`}
                  className="font-semibold underline"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell className="px-4 py-2 align-middle">
                {user.email}
              </TableCell>
              <TableCell className="px-4 py-2 align-middle">
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role === "admin" ? "Administrator" : "Korisnik"}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-2 align-middle">
                {formatDateTime(user.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-2 align-middle">
                {user.activityCount} aktivnosti
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-semibold">Statistika</h1>
        <Separator />

        <AuditLogStats
          stats={{
            totalCount: stats,
            createCount: 0,
            updateCount: 0,
            deleteCount: 0,
            approveCount: 0,
            commentCount: 0,
          }}
        />
      </div>
    </TitleTemplate>
  );
}
