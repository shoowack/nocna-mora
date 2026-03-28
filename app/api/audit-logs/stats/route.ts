import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalCount, createCount, updateCount, deleteCount, approveCount, commentCount] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { action: "CREATE" } }),
      prisma.auditLog.count({ where: { action: "UPDATE" } }),
      prisma.auditLog.count({ where: { action: "DELETE" } }),
      prisma.auditLog.count({ where: { action: "APPROVE" } }),
      prisma.auditLog.count({ where: { action: "COMMENT" } }),
    ]);

    const stats = {
      totalCount,
      createCount,
      updateCount,
      deleteCount,
      approveCount,
      commentCount,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Failed to fetch audit log statistics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
