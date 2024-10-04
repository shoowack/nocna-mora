import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";
import { generateSlug } from "@/lib/slugify";

export const PUT = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;

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
    const data = await request.json();

    const updatedSlug = generateSlug(`${data.firstName} ${data.lastName}`);

    const updatedParticipant = await prisma.participant.update({
      where: { slug: params.slug },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname,
        bio: data.bio,
        gender: data.gender,
        birthDate: data.birthDate,
        deathDate: data.deathDate,
        slug: updatedSlug,
        type: data.type,
      },
    });

    return NextResponse.json(
      { participant: updatedParticipant },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
