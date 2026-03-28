"use client";

import { useState } from "react";
import { AuditLogTable } from "./audit-log-table";
import { AuditLogFilters } from "./audit-log-filters";
import { transformAuditLogs } from "@/lib/audit-transformers";

interface AuditLogSectionProps {
  logs: any[];
}

export function AuditLogSection({ logs }: AuditLogSectionProps) {
  const [filters, setFilters] = useState<{
    action?: string;
    entityType?: string;
  }>({});

  console.log("raw logs:", logs);
  console.log("logs[0]:", logs?.[0]);

  const transformedLogs = transformAuditLogs(logs);

  console.log("transformedLogs:", transformedLogs);
  console.log("transformedLogs[0]:", transformedLogs?.[0]);

  const filteredLogs = transformedLogs.filter((log) => {
    if (filters.action && log.action !== filters.action) {
      return false;
    }
    if (filters.entityType && log.entityType !== filters.entityType) {
      return false;
    }
    return true;
  });
  console.log("filteredLogs:", filteredLogs);

  const handleFilterChange = (newFilters: {
    action?: string;
    entityType?: string;
    userId?: string;
  }) => {
    setFilters({
      action: newFilters.action,
      entityType: newFilters.entityType,
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <AuditLogFilters onFilterChange={handleFilterChange} />
      <AuditLogTable logs={filteredLogs} />
    </div>
  );
}
