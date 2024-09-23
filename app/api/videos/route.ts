import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const videos = await prisma.video.findMany({
      include: { createdBy: true, actors: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
