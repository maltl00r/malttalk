import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const glossaryItems = await prisma.glossary_items.findMany({
      include: {
        reading_contents: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { word: "asc" },
    });

    return NextResponse.json(glossaryItems);
  } catch (error) {
    console.error("Error fetching glossary items:", error);
    return NextResponse.json(
      { error: "Failed to fetch glossary items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reading_id, word, definition, image_url, synonym_english } = await request.json();
    const readingId = Number(reading_id);

    if (!Number.isInteger(readingId) || readingId <= 0 || !word || !definition) {
      return NextResponse.json(
        { error: "reading_id must be a valid integer, word and definition are required" },
        { status: 400 }
      );
    }

    const readingContent = await prisma.reading_contents.findUnique({ 
      where: { id: readingId } 
    });

    if (!readingContent) {
      return NextResponse.json({ error: "Reading content not found" }, { status: 404 });
    }

    const glossaryItem = await prisma.glossary_items.create({
      data: {
        reading_id: readingId,
        word,
        definition,
        image_url,
        synonym_english,
      },
    });

    return NextResponse.json(glossaryItem, { status: 201 });
  } catch (error) {
    console.error("Error creating glossary item:", error);
    return NextResponse.json(
      { error: "Failed to create glossary item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, word, definition, image_url, synonym_english } = await request.json();
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    const glossaryItem = await prisma.glossary_items.update({
      where: { id: itemId },
      data: {
        word: word !== undefined ? word : undefined,
        definition: definition !== undefined ? definition : undefined,
        image_url: image_url !== undefined ? image_url : undefined,
        synonym_english: synonym_english !== undefined ? synonym_english : undefined,
      },
      include: {
        reading_contents: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return NextResponse.json(glossaryItem);
  } catch (error) {
    console.error("Error updating glossary item:", error);
    return NextResponse.json(
      { error: "Failed to update glossary item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.glossary_items.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Glossary item deleted" });
  } catch (error) {
    console.error("Error deleting glossary item:", error);
    return NextResponse.json(
      { error: "Failed to delete glossary item" },
      { status: 500 }
    );
  }
}
