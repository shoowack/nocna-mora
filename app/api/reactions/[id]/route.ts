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
        { message: "Reaction ID is required." },
        { status: 400 }
      );
    }

    const reaction = await prisma.reaction.findUnique({
      where: { id },
    });

    if (!reaction) {
      return NextResponse.json(
        { message: "Reaction not found" },
        { status: 404 }
      );
    }

    // Ensure the user attempting to delete the reaction is the creator
    if (reaction.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You do not have permission to delete this reaction." },
        { status: 403 }
      );
    }

    await prisma.reaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Reaction deleted." }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete reaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
