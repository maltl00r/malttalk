import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, url, description } = await request.json();

    if (!lesson_id || !url) {
      return NextResponse.json(
        { error: "lesson_id and url are required" },
        { status: 400 }
      );
    }

    const videoContent = await prisma.video_contents.create({
      data: {
        lesson_id,
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
