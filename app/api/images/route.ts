import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

export const GET = auth(async () => {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: Request) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const { url, title } = data;

    if (!url) {
      return NextResponse.json(
        { message: "Image URL is required." },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        url,
        title,
        userId: session.user.id,
      },
    });

    await logAudit({
      action: AuditAction.CREATE,
      entityType: AuditEntityType.IMAGE,
      entityId: image.id,
      details: {
        title: title || "Untitled Image",
        url,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error("Failed to create image:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
