import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slugify";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = (request as any).auth;
  const { slug } = await params;

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
    const participant = await prisma.participant.findUnique({
      where: { slug },
    });

    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    const newSlug = generateSlug(`${data.firstName} ${data.lastName}`);

    const updatedParticipant = await prisma.participant.update({
      where: { slug },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname,
        bio: data.bio,
        gender: data.gender,
        birthDate: data.birthDate,
        deathDate: data.deathDate,
        slug: newSlug,
        type: data.type,
      },
    });

    await logAudit({
      action: AuditAction.UPDATE,
      entityType: AuditEntityType.PARTICIPANT,
      entityId: updatedParticipant.id,
      details: {
        name: `${data.firstName} ${data.lastName}`,
        slug: newSlug,
        nickname: data.nickname,
      },
    });

    return NextResponse.json({ participant: updatedParticipant }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = (request as any).auth;
  const { slug } = await params;

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
    const participant = await prisma.participant.findUnique({
      where: { slug },
    });

    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      );
    }

    await prisma.participant.delete({
      where: { slug },
    });

    await logAudit({
      action: AuditAction.DELETE,
      entityType: AuditEntityType.PARTICIPANT,
      entityId: participant.id,
      details: {
        name: `${participant.firstName} ${participant.lastName}`,
        slug: participant.slug,
      },
    });

    return NextResponse.json(
      { message: "Participant deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
