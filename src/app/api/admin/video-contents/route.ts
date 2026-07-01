import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, url, description } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !url) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer and url is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "video") {
      return NextResponse.json({ error: "Selected lesson is not a video lesson" }, { status: 400 });
    }

    const videoContent = await prisma.video_contents.create({
      data: {
        lesson_id: lessonId,
        url,
        description,
      },
    });

    return NextResponse.json(videoContent, { status: 201 });
  } catch (error) {
    console.error("Error creating video content:", error);
    return NextResponse.json(
      { error: "Failed to create video content" },
      { status: 500 }
    );
  }
}
