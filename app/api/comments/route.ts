import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";

export const POST = auth(async (request: Request) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate videoId
    if (!data.videoId || data.videoId.trim() === "") {
      return NextResponse.json(
        { message: "VideoId is required." },
        { status: 400 }
      );
    }

    // Validate content
    if (!data.content || data.content.trim() === "") {
      return NextResponse.json(
        { message: "Comment is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (data.content.length > 500) {
      return NextResponse.json(
        { message: "Comment cannot exceed 500 characters." },
        { status: 400 }
      );
    }

    const category = await prisma.comment.create({
      data: {
        content: data.content,
        video: { connect: { id: data.videoId } }, // Connect the comment to the video by id
        createdBy: { connect: { email: session.user.email } }, // Associate the comment with the logged-in user
        approved: false, // Default to not approved
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
