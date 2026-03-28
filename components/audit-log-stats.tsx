"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface AuditLogStatsProps {
  stats: {
    totalCount: number;
    createCount: number;
    updateCount: number;
    deleteCount: number;
    approveCount: number;
    commentCount: number;
  };
}

export function AuditLogStats({ stats }: AuditLogStatsProps) {
  const statItems = [
    { label: "Ukupno radnji", value: stats.totalCount },
    { label: "Stvorenih entiteta", value: stats.createCount },
    { label: "Ažuriranih entiteta", value: stats.updateCount },
    { label: "Obrisanih entiteta", value: stats.deleteCount },
    { label: "Odobrenja", value: stats.approveCount },
    { label: "Komentari", value: stats.commentCount },
  ];

  return (
    <Table>
      <TableBody>
        {statItems.map((item) => (
          <TableRow key={item.label}>
            <TableCell className="!py-2 px-4 font-medium">
              {item.label}
            </TableCell>
            <TableCell className="!py-2 px-4">{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
