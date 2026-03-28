import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { actionLabels } from "@/lib/audit-transformers";
import { Badge, BadgeVariants } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/date";

interface AuditLogTableProps {
  logs: {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    entityName?: string;
    details?: {
      [key: string]: unknown;
    };
    createdAt: Date;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  }[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return logs.length === 0 ? (
    <div className="flex grow items-center justify-center pb-10 pt-20">
      <div>Nema aktivnosti za korisnika</div>
    </div>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-auto pb-3">Vremenska oznaka</TableHead>
          <TableHead className="h-auto pb-3">Korisnik</TableHead>
          <TableHead className="h-auto pb-3">Radnja</TableHead>
          <TableHead className="h-auto pb-3">Vrsta entiteta</TableHead>
          <TableHead className="h-auto pb-3">Naziv entiteta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          console.log("log:", log);

          return (
            <TableRow key={log.id}>
              <TableCell className="!py-2 px-4">
                {formatDateTime(log.createdAt)}
              </TableCell>
              <TableCell className="!py-2 px-4">
                {log.user?.name || log.user?.email || "Unknown User"}
              </TableCell>
              <TableCell className="!py-2 px-4">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      log.action === actionLabels.CREATE ||
                      log.action === actionLabels.APPROVE ||
                      log.action === actionLabels.UPDATE
                        ? BadgeVariants.SUCCESS
                        : // : log.action === actionLabels.COMMENT ||
                          //     log.action === actionLabels.LIKE
                          //   ? BadgeVariants.SECONDARY
                          log.action === actionLabels.DELETE ||
                            log.action === actionLabels.REJECT
                          ? BadgeVariants.DESTRUCTIVE
                          : BadgeVariants.OUTLINE
                    }
                  >
                    {log.action}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="!py-2 px-4">{log.entityType}</TableCell>
              <TableCell className="!py-2 px-4">
                {log.entityName || log.entityId}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
