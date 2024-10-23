import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slugify";
import { auth } from "auth";

export const POST = auth(async (request: Request & { auth: any }) => {
  if (!request.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const slug = generateSlug(`${data.firstName} ${data.lastName}`);

    const newParticipant = await prisma.participant.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname,
        bio: data.bio,
        gender: data.gender,
        birthDate: data.birthDate,
        deathDate: data.deathDate,
        userId: data.userId,
        slug: slug,
        type: data.type,
      },
    });

    return NextResponse.json({ participant: newParticipant }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const GET = auth(async () => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(participants, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
