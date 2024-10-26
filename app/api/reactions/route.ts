import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";
import { ReactionType } from "@prisma/client";

export const POST = auth(async (request: Request) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { videoId, type } = data;

    if (!videoId || !type) {
      return NextResponse.json(
        { message: "Video ID and reaction type are required." },
        { status: 400 }
      );
    }

    // Check if `type` is a valid ReactionType
    if (!Object.values(ReactionType).includes(type)) {
      return NextResponse.json(
        { message: "Invalid reaction type." },
        { status: 400 }
      );
    }

    const reaction = await prisma.reaction.upsert({
      where: {
        videoId_userId: {
          videoId,
          userId: session.user.id,
        },
      },
      update: {
        type,
      },
      create: {
        videoId,
        userId: session.user.id,
        type,
      },
    });

    return NextResponse.json({ reaction }, { status: 201 });
  } catch (error) {
    console.error("Failed to add or update reaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
