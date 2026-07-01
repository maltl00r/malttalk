import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const lesson = await prisma.lessons.findUnique({
      where: { uuid },
      include: {
        topics: {
          select: {
            id: true,
            slug: true,
            title: true,
            course_slug: true,
          },
        },
        video_contents: true,
        flashcard_contents: true,
        drag_drop_contents: true,
        reading_contents: {
          include: {
            glossary_items: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
