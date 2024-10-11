import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slugify";
import { auth } from "auth";

export const GET = auth(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      where: { deletedAt: null },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: Request) => {
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

    // Validate title
    if (!data.title || data.title.trim() === "") {
      return NextResponse.json(
        { message: "Title is required and cannot be empty." },
        { status: 400 }
      );
    }

    const slug = generateSlug(data.title);

    const category = await prisma.category.create({
      data: {
        title: data.title,
        slug: slug,
        createdBy: { connect: { email: session.user.email } },
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
