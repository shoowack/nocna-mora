import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import prisma from "@/lib/prisma";

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
  async (request: Request, { params }: { params: { id: string } }) => {
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

      const updatedVideo = await prisma.video.update({
        where: { id: params.id },
        data: {
          title: data.title,
          videoId: data.videoId,
          duration: data.duration,
          airedDate: data.airedDate,
          provider: data.provider,
          published: data.published,
          actors: {
            set: [], // Clear existing connections
            connect: data.actors.map((id: number) => ({ id })),
          },
          categories: {
            set: [], // Clear existing connections
            connect: data.categories.map((id: number) => ({ id })),
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

export const DELETE = auth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;

    const session = (request as any).auth;

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      const video = await prisma.video.findUnique({
        where: { id },
      });

      if (!video) {
        return NextResponse.json(
          { error: "Video not found." },
          { status: 404 }
        );
      }

      await prisma.video.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "Video deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      return NextResponse.json(
        { error: "An error occurred while deleting the video." },
        { status: 500 }
      );
    }
  }
);
