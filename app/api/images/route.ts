import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      include: { uploadedBy: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ images }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
