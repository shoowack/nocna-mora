import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

export const DELETE = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      {
        message: "You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Comment ID is required." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      select: {
        videoId: true,
        content: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );
    }

    const softDeletedComment = await prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    await logAudit({
      action: AuditAction.DELETE,
      entityType: AuditEntityType.COMMENT,
      entityId: id,
      details: {
        videoId: comment.videoId,
        content: comment.content,
      },
    });

    return NextResponse.json({ comment: softDeletedComment }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
