import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, text, category, feedback_message_wrong } =
      await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !text || !category) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer, text, and category are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "drag_drop") {
      return NextResponse.json({ error: "Selected lesson is not a drag-drop lesson" }, { status: 400 });
    }

    const dragDropContent = await prisma.drag_drop_contents.create({
      data: {
        lesson_id: lessonId,
        text,
        category,
        feedback_message_wrong,
      },
    });

    return NextResponse.json(dragDropContent, { status: 201 });
  } catch (error) {
    console.error("Error creating drag-drop content:", error);
    return NextResponse.json(
      { error: "Failed to create drag-drop content" },
      { status: 500 }
    );
  }
}
