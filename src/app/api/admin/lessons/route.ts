import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic_id, type, title } = await request.json();

    if (!topic_id || !type || !title) {
      return NextResponse.json(
        { error: "topic_id, type, and title are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.create({
      data: {
        topic_id,
        type,
        title,
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

    const lessons = await prisma.lessons.findMany({
      where: topicId ? { topic_id: parseInt(topicId) } : undefined,
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
