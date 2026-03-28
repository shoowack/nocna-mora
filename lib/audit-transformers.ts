import type { AuditActionType, AuditEntityTypeType } from "@/lib/audit";

interface AuditLog {
  id: string;
  action: AuditActionType;
  entityType: AuditEntityTypeType;
  entityId: string;
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
}

export const actionLabels: Record<AuditActionType, string> = {
  CREATE: "Kreiran",
  UPDATE: "Ažuriran",
  DELETE: "Obrisan",
  APPROVE: "Odobren",
  REJECT: "Odbijen",
  COMMENT: "Komentar",
  LIKE: "Reakcija",
};

export function transformAuditLog(log: AuditLog): {
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
} {
  const entityLabels: Record<AuditEntityTypeType, string> = {
    VIDEO: "Video",
    COMMENT: "Comment",
    CATEGORY: "Category",
    PARTICIPANT: "Participant",
    IMAGE: "Image",
  };

  let entityName: string | undefined = undefined;

  if (log.entityType === "VIDEO" && log.details?.title) {
    entityName = log.details.title as string;
  } else if (log.entityType === "COMMENT" && log.details?.content) {
    entityName = (log.details.content as string).substring(0, 50);
  } else if (log.entityType === "CATEGORY" && log.details?.title) {
    entityName = log.details.title as string;
  } else if (log.entityType === "PARTICIPANT" && log.details?.name) {
    entityName = log.details.name as string;
  }

  return {
    id: log.id,
    action: actionLabels[log.action],
    entityType: entityLabels[log.entityType],
    entityId: log.entityId,
    entityName,
    details: log.details,
    createdAt: log.createdAt,
    user: log.user,
  };
}

export function transformAuditLogs(logs: AuditLog[]): {
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
}[] {
  return logs.map(transformAuditLog);
}
