import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lessons = await prisma.lessons.findMany({
      include: {
        topics: true,
        video_contents: true,
      },
      take: 10,
    });

    return NextResponse.json({
      count: lessons.length,
      lessons: lessons.map(l => ({
        id: l.id,
        uuid: l.uuid,
        title: l.title,
        type: l.type,
        topic_id: l.topic_id,
        course: l.topics?.course_slug,
      })),
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
