import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

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

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        video: { connect: { id: data.videoId } },
        createdBy: { connect: { email: session.user.email } },
        approved: false,
      },
    });

    await logAudit({
      action: AuditAction.COMMENT,
      entityType: AuditEntityType.COMMENT,
      entityId: comment.id,
      details: {
        videoId: data.videoId,
        content: data.content,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

export const GET = auth(async (request: Request) => {
  const session = (request as any).auth;

  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("videoId");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const sort = url.searchParams.get("sort") || "desc";

    if (!videoId) {
      return NextResponse.json(
        { message: "Video ID is required." },
        { status: 400 }
      );
    }

    const isAdmin = session?.user?.role === "admin";
    const offset = (page - 1) * limit;

    // Fetch paginated comments with sorting
    const comments = await prisma.comment.findMany({
      where: isAdmin
        ? { videoId }
        : session?.user
        ? {
            videoId,
            deletedAt: null,
            OR: [
              { approved: true },
              { approved: false, createdById: session?.user?.id },
            ],
          }
        : {
            videoId,
            deletedAt: null,
            approved: true,
          },
      skip: offset,
      take: limit,
      orderBy: [
        {
          createdAt: sort === "desc" ? "desc" : "asc",
        },
      ],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        approved: true,
        deletedAt: true,
        videoId: true,
        createdById: true,
        createdBy: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const totalApprovedComments = await prisma.comment.count({
      where: {
        videoId,
        deletedAt: null,
        approved: true,
      },
    });

    const totalUnapprovedComments = isAdmin
      ? await prisma.comment.count({
          where: {
            videoId,
            deletedAt: null,
            approved: false,
          },
        })
      : 0;

    const totalDeletedComments = isAdmin
      ? await prisma.comment.count({
          where: {
            videoId,
            deletedAt: {
              not: null,
            },
          },
        })
      : 0;

    const totalUnapprovedCommentsForUser = await prisma.comment.count({
      where: {
        videoId,
        deletedAt: null,
        approved: false,
        createdById: session?.user?.id,
      },
    });

    return NextResponse.json({
      comments,
      totalApprovedComments,
      totalUnapprovedComments,
      totalUnapprovedCommentsForUser,
      totalDeletedComments,
      currentPage: page,
      totalPages: Math.ceil(
        (isAdmin
          ? totalApprovedComments +
              totalUnapprovedComments +
              totalDeletedComments
          : session?.user
          ? totalApprovedComments + totalUnapprovedCommentsForUser
          : totalApprovedComments) / limit
      ),
    });
  } catch (error) {
    console.error("Failed to get comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
