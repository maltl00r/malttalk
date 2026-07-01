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

export async function PUT(request: NextRequest) {
  try {
    const { id, slug, title, course_slug } = await request.json();
    const topicId = Number(id);

    if (!Number.isInteger(topicId) || topicId <= 0 || !slug || !title || !course_slug) {
      return NextResponse.json(
        { error: "id, slug, title, and course_slug are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topics.update({
      where: { id: topicId },
      data: { slug, title, course_slug },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const topicId = Number(id);

    if (!Number.isInteger(topicId) || topicId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.topics.delete({
      where: { id: topicId },
    });

    return NextResponse.json({ message: "Topic deleted" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
