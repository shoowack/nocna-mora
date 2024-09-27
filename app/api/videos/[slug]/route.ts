import { NextResponse } from "next/server";
import { auth } from "auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slugify";

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const video = await prisma.video.findUnique({
      where: { slug: params.slug },
      include: {
        actors: true,
        categories: true,
        createdBy: true,
      },
    });

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = auth(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const session = (request as any).auth;

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      const data = await request.json();

      // Validate provider if it's being updated
      if (data.provider) {
        const validProviders = ["YOUTUBE", "VIMEO", "DAILYMOTION"];
        if (!validProviders.includes(data.provider)) {
          return NextResponse.json(
            { message: "Invalid video provider" },
            { status: 400 }
          );
        }
      }

      const slug = generateSlug(data.title);

      const updatedVideo = await prisma.video.update({
        where: { slug: params.slug },
        data: {
          title: data.title,
          url: data.url,
          duration: data.duration,
          airedDate: data.airedDate,
          provider: data.provider,
          slug: slug,
          actors: {
            set: [], // Clear existing connections
            connect: data.actorIds.map((id: number) => ({ id })),
          },
          categories: {
            set: [], // Clear existing connections
            connect: data.categoryIds.map((id: number) => ({ id })),
          },
        },
      });

      return NextResponse.json({ video: updatedVideo }, { status: 200 });
    } catch (error) {
      console.error("Error updating video:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
