import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slugify";
import { logAudit, AuditAction, AuditEntityType } from "@/lib/audit";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = (request as any).auth;
  const { slug } = await params;

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
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    const newSlug = generateSlug(data.title);

    const updatedCategory = await prisma.category.update({
      where: { slug },
      data: {
        title: data.title,
        slug: newSlug,
        description: data.description,
      },
    });

    await logAudit({
      action: AuditAction.UPDATE,
      entityType: AuditEntityType.CATEGORY,
      entityId: updatedCategory.id,
      details: {
        title: data.title,
        slug: newSlug,
      },
    });

    return NextResponse.json({ category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = (request as any).auth;
  const { slug } = await params;

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
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await prisma.category.update({
      where: { slug },
      data: {
        deletedAt: new Date(),
      },
    });

    await logAudit({
      action: AuditAction.DELETE,
      entityType: AuditEntityType.CATEGORY,
      entityId: category.id,
      details: {
        title: category.title,
        slug: category.slug,
      },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
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
