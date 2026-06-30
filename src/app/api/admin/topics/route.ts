import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { slug, title, course_slug } = await request.json();

    if (!slug || !title || !course_slug) {
      return NextResponse.json(
        { error: "slug, title, and course_slug are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topics.create({
      data: {
        slug,
        title,
        course_slug,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug");

    const topics = await prisma.topics.findMany({
      where: courseSlug ? { course_slug: courseSlug } : undefined,
      orderBy: { slug: "asc" },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
