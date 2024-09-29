import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";

export async function GET(request: Request) {
  try {
    const videos = await prisma.video.findMany({
      include: { createdBy: true, actors: true, categories: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = auth(async (request: Request) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate provider
    const validProviders = ["YOUTUBE", "VIMEO", "DAILYMOTION"];
    if (!validProviders.includes(data.provider)) {
      return NextResponse.json(
        { message: "Invalid video provider" },
        { status: 400 }
      );
    }

    const newVideo = await prisma.video.create({
      data: {
        title: data.title,
        videoId: data.videoId,
        duration: data.duration,
        airedDate: data.airedDate,
        provider: data.provider,
        userId: session.user.id,
        published: data.published,
        actors: {
          connect: data.actors.map((id: number) => ({ id })),
        },
        categories: {
          connect: data.categories.map((id: number) => ({ id })),
        },
      },
    });

    return NextResponse.json({ video: newVideo }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
