-- This is a placeholder migration file for audit logs
-- Create audit_log table
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" "AuditEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add primary key constraint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");

-- Add foreign key constraint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index on userId for faster lookups
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- Create index on entityType for faster lookups
CREATE INDEX "audit_logs_entityType_idx" ON "audit_logs"("entityType");

-- Create index on action for faster lookups
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- Create index on createdAt for faster lookups
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- Create composite index for common queries
CREATE INDEX "audit_logs_userId_entityType_idx" ON "audit_logs"("userId", "entityType");
