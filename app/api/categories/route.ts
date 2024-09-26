import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slugify";
import { auth } from "auth";

export const GET = async () => {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
};

export const POST = auth(async (request: Request) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const slug = generateSlug(data.name);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
