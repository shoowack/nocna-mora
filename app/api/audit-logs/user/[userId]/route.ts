import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AuditLogFilterSchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(20),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    const parsedFilters = AuditLogFilterSchema.parse(searchParams);
    const { page, pageSize } = parsedFilters;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [logs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.auditLog.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      logs,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error(`Failed to fetch audit logs for user ${userId}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
