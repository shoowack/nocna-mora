import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";

export const PATCH = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;
  const commentId = params.id;

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      {
        message: "You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  try {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        deletedAt: null, // Restore comment by removing the deleted timestamp
      },
    });

    return NextResponse.json({ message: "Comment restored successfully." });
  } catch (error) {
    console.error("Error restoring comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
