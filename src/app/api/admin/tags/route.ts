import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const tags = await prisma.tags.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "slug and name are required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existing = await prisma.tags.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 409 }
      );
    }

    const tag = await prisma.tags.create({
      data: { slug, name },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Error creating tag" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, slug, name } = await request.json();
    const tagId = Number(id);

    if (!Number.isInteger(tagId) || tagId <= 0 || !slug || !name) {
      return NextResponse.json(
        { error: "id, slug and name are required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tags.update({
      where: { id: tagId },
      data: { slug, name },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Error updating tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("id");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Delete the tag (cascade should handle relations)
    await prisma.tags.delete({
      where: { id: parseInt(tagId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Error deleting tag" }, { status: 500 });
  }
}
