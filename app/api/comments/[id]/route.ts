import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";

export const DELETE = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
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
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow admins or the user who created the comment to delete it
    if (
      session.user.role !== "admin" &&
      comment.createdById !== session.user.id
    ) {
      return NextResponse.json(
        { message: "You do not have permission to delete this comment." },
        { status: 403 }
      );
    }

    if (session.user.role === "admin") {
      // Soft delete for admins: set deletedAt to current timestamp
      await prisma.comment.update({
        where: { id: id },
        data: { deletedAt: new Date() },
      });
      return NextResponse.json(
        { message: "Comment soft deleted." },
        { status: 200 }
      );
    } else if (comment.createdById === session.user.id) {
      // Hard delete for regular users
      await prisma.comment.delete({
        where: { id: id },
      });
      return NextResponse.json(
        { message: "Comment deleted." },
        { status: 200 }
      );
    }

    // Fallback response if nothing matched
    return NextResponse.json(
      { message: "Action could not be completed." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
