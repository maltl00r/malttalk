import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      lesson_id,
      front_image,
      back_title,
      back_pronunciation,
      lang,
    } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !back_title || !lang) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer, back_title, and lang are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "flashcards") {
      return NextResponse.json({ error: "Selected lesson is not a flashcards lesson" }, { status: 400 });
    }

    const flashcardContent = await prisma.flashcard_contents.create({
      data: {
        lesson_id: lessonId,
        front_image,
        back_title,
        back_pronunciation,
        lang,
      },
    });

    return NextResponse.json(flashcardContent, { status: 201 });
  } catch (error) {
    console.error("Error creating flashcard content:", error);
    return NextResponse.json(
      { error: "Failed to create flashcard content" },
      { status: 500 }
    );
  }
}
