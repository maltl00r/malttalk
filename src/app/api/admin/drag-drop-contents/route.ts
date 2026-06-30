import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, text, category, feedback_message_wrong } =
      await request.json();

    if (!lesson_id || !text || !category) {
      return NextResponse.json(
        { error: "lesson_id, text, and category are required" },
        { status: 400 }
      );
    }

    const dragDropContent = await prisma.drag_drop_contents.create({
      data: {
        lesson_id,
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
