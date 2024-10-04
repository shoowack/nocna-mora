import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";

export const GET = auth(async (request: Request, { params }: any) => {
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
});
