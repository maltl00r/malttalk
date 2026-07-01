import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const lessonId = request.nextUrl.searchParams.get("lessonId");

    if (!lessonId || !Number.isInteger(Number(lessonId))) {
      return NextResponse.json(
        { error: "Valid lessonId query parameter required" },
        { status: 400 }
      );
    }

    const readingContents = await prisma.reading_contents.findMany({
      where: { lesson_id: Number(lessonId) },
      include: {
        glossary_items: true,
      },
    });

    return NextResponse.json(readingContents);
  } catch (error) {
    console.error("Error fetching reading contents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
