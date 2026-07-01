import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic_id, type, title } = await request.json();
    const topicId = Number(topic_id);
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!Number.isInteger(topicId) || topicId <= 0 || !["video", "flashcards", "drag_drop"].includes(type) || !normalizedTitle) {
      return NextResponse.json(
        { error: "topic_id must be a valid integer, type must be one of video/flashcards/drag_drop, and title is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.create({
      data: {
        topic_id: topicId,
        type,
        title: normalizedTitle,
      },
      include: {
        topics: true,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");
    const type = searchParams.get("type");

    const lessons = await prisma.lessons.findMany({
      where:
        topicId || type
          ? {
              ...(topicId ? { topic_id: Number(topicId) } : {}),
              ...(type ? { type: type as "video" | "flashcards" | "drag_drop" } : {}),
            }
          : undefined,
      include: {
        topics: true,
        video_contents: true,
        flashcard_contents: true,
        drag_drop_contents: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
