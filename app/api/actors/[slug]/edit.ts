import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";
import { generateSlug } from "@/lib/slugify";

export const PUT = auth(
  async (
    request: Request & { auth: any },
    { params }: { params: { slug: string } }
  ) => {
    if (!request.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      const data = await request.json();

      const updatedSlug = generateSlug(`${data.firstName} ${data.lastName}`);

      const updatedActor = await prisma.actor.update({
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

      return NextResponse.json({ actor: updatedActor }, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
);
