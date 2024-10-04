import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";

export const GET = auth(
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
      const participant = await prisma.participant.findUnique({
        where: { slug: params.slug },
      });

      if (!participant) {
        return NextResponse.json(
          { message: "Participant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(participant, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
);
