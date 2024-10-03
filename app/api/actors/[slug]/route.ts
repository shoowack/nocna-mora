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
      const actor = await prisma.actor.findUnique({
        where: { slug: params.slug },
      });

      if (!actor) {
        return NextResponse.json(
          { message: "Actor not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(actor, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
);
