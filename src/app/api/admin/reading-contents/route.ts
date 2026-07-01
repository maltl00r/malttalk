import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, text } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !text) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer and text is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "reading") {
      return NextResponse.json({ error: "Selected lesson is not a reading lesson" }, { status: 400 });
    }

    const readingContent = await prisma.reading_contents.create({
      data: {
        lesson_id: lessonId,
        text,
      },
    });

    return NextResponse.json(readingContent, { status: 201 });
  } catch (error) {
    console.error("Error creating reading content:", error);
    return NextResponse.json(
      { error: "Failed to create reading content" },
      { status: 500 }
    );
  }
}
