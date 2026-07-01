import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic_id, type, title } = await request.json();
    const topicId = Number(topic_id);
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!Number.isInteger(topicId) || topicId <= 0 || !["video", "flashcards", "drag_drop", "reading"].includes(type) || !normalizedTitle) {
      return NextResponse.json(
        { error: "topic_id must be a valid integer, type must be one of video/flashcards/drag_drop/reading, and title is required" },
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
              ...(type ? { type: type as "video" | "flashcards" | "drag_drop" | "reading" } : {}),
            }
          : undefined,
      include: {
        topics: true,
        video_contents: true,
        flashcard_contents: true,
        drag_drop_contents: true,
        reading_contents: true,
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

export async function PUT(request: NextRequest) {
  try {
    const { id, topic_id, type, title } = await request.json();
    const lessonId = Number(id);
    const topicId = Number(topic_id);
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !Number.isInteger(topicId) || topicId <= 0 || !["video", "flashcards", "drag_drop", "reading"].includes(type) || !normalizedTitle) {
      return NextResponse.json(
        { error: "id and topic_id must be valid integers, type must be one of video/flashcards/drag_drop/reading, and title is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.update({
      where: { id: lessonId },
      data: {
        topic_id: topicId,
        type,
        title: normalizedTitle,
      },
      include: {
        topics: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const lessonId = Number(id);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.lessons.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ message: "Lesson deleted" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
