import { auth } from "auth";
import prisma from "@/lib/prisma";

export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  COMMENT: "COMMENT",
  LIKE: "LIKE",
} as const;

export const AuditEntityType = {
  VIDEO: "VIDEO",
  COMMENT: "COMMENT",
  CATEGORY: "CATEGORY",
  PARTICIPANT: "PARTICIPANT",
  IMAGE: "IMAGE",
} as const;

export type AuditActionType = typeof AuditAction[keyof typeof AuditAction];
export type AuditEntityTypeType = typeof AuditEntityType[keyof typeof AuditEntityType];

interface AuditLogInput {
  action: AuditActionType;
  entityType: AuditEntityTypeType;
  entityId: string;
  details?: {
    [key: string]: unknown;
  };
}

export async function logAudit({ action, entityType, entityId, details }: AuditLogInput) {
  const session = await auth();

  if (!session?.user?.id) {
    console.warn("Audit log attempted without authenticated user");
    return null;
  }

  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId: session.user.id,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
      },
    });

    return auditLog;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return null;
  }
}
