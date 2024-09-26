import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "auth";
import { generateSlug } from "@/lib/slugify";

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
};

export const PUT = auth(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const session = (request as any).auth;

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      const data = await request.json();
      const updatedCategory = await prisma.category.update({
        where: { slug: params.slug },
        data: {
          name: data.name,
          slug: generateSlug(data.name),
        },
      });

      return NextResponse.json({ category: updatedCategory });
    } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = auth(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const session = (request as any).auth;

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      await prisma.category.delete({
        where: { slug: params.slug },
      });

      return NextResponse.json(
        { message: "Category deleted" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
