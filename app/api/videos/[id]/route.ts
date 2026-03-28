import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VideoProvider } from "@prisma/client";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        createdBy: true,
        participants: true,
        categories: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ video }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (request as any).auth;
  const { id } = await params;

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
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Validate provider
    const validProviders = Object.values(VideoProvider);

    if (!validProviders.includes(data.provider)) {
      return NextResponse.json(
        { message: "Invalid video provider" },
        { status: 400 }
      );
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        title: data.title,
        videoId: data.videoId,
        duration: data.duration,
        airedDate: data.airedDate,
        provider: data.provider,
        published: data.published,
        participants: {
          set: data.participants.map((id: number) => ({ id })),
        },
        categories: {
          set: data.categories.map((id: number) => ({ id })),
        },
      },
    });

    await logAudit({
      action: AuditAction.UPDATE,
      entityType: AuditEntityType.VIDEO,
      entityId: id,
      details: {
        title: data.title,
        provider: data.provider,
        published: data.published,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (request as any).auth;
  const { id } = await params;

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
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    await logAudit({
      action: AuditAction.DELETE,
      entityType: AuditEntityType.VIDEO,
      entityId: id,
      details: {
        title: video.title,
      },
    });

    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
