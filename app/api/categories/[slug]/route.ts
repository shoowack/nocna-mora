import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "auth";
import { generateSlug } from "@/lib/slugify";

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug, deletedAt: null },
  });

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
};

export const PUT = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updatedCategory = await prisma.category.update({
      where: { slug: params.slug },
      data: {
        title: data.title,
        slug: generateSlug(data.title),
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
});

export const DELETE = auth(async (request: Request, { params }: any) => {
  const session = (request as any).auth;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    // TODO: Authorization Check (e.g., only admins or creators can delete)
    // if (category.userId !== user.id && !user.isAdmin) {
    //   return NextResponse.json(
    //     { error: "Forbidden. You don't have permission to delete this category." },
    //     { status: 403 }
    //   );
    // }

    // Soft delete: set deletedAt to current timestamp
    await prisma.category.update({
      where: { slug: params.slug },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the category." },
      { status: 500 }
    );
  }
});
