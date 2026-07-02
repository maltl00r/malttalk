/**
 * LESSONS API ROUTE
 * 
 * Handles CRUD operations for learning units within topics.
 * Lessons represent individual learning items with specific content types:
 * video, flashcards, drag-drop exercises, or reading comprehension.
 * 
 * Endpoints:
 * - POST /api/admin/lessons - Create a new lesson
 * - GET /api/admin/lessons - List lessons (optionally filtered by topic or type)
 * - PUT /api/admin/lessons - Update an existing lesson
 * - DELETE /api/admin/lessons?id=... - Delete a lesson by ID
 * 
 * @module api/admin/lessons
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create a new lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - topic_id (number, required): ID of the parent topic
 *   - type (string, required): Lesson content type (video|flashcards|drag_drop|reading)
 *   - title (string, required): Display name of the lesson
 *   - description (string, optional): Detailed lesson description
 *   - slug (string, optional): URL-friendly identifier
 * 
 * @returns {NextResponse} Created lesson object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const { topic_id, type, title } = await request.json();
    const topicId = Number(topic_id);
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!Number.isInteger(topicId) || topicId <= 0 || !["video", "flashcards", "drag_drop", "reading", "visio_acoustic", "writing_challenges", "mental_agility", "closing_exam", "grammar_guides", "listening", "icebreaker"].includes(type) || !normalizedTitle) {
      return NextResponse.json(
        { error: "topic_id must be a valid integer, type must be one of video/flashcards/drag_drop/reading/visio_acoustic/writing_challenges/mental_agility/closing_exam/grammar_guides/listening/icebreaker, and title is required" },
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
    console.error("[Error] POST /api/admin/lessons:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Retrieve lessons optionally filtered by topic ID or content type
 * 
 * Query Parameters:
 *   - topicId (optional): Filter lessons by parent topic ID
 *   - type (optional): Filter by content type (video|flashcards|drag_drop|reading)
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of lessons with related content data, or error with 500 status
 */
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
    console.error("[Error] GET /api/admin/lessons:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update an existing lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - id (number, required): ID of the lesson to update
 *   - topic_id (number, required): Parent topic ID
 *   - type (string, required): Lesson content type
 *   - title (string, required): Updated lesson title
 * 
 * @returns {NextResponse} Updated lesson object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, topic_id, type, title } = await request.json();
    const lessonId = Number(id);
    const topicId = Number(topic_id);
    const normalizedTitle = typeof title === "string" ? title.trim() : "";

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !Number.isInteger(topicId) || topicId <= 0 || !["video", "flashcards", "drag_drop", "reading", "visio_acoustic", "writing_challenges", "mental_agility", "closing_exam", "grammar_guides", "listening", "icebreaker"].includes(type) || !normalizedTitle) {
      return NextResponse.json(
        { error: "id and topic_id must be valid integers, type must be one of video/flashcards/drag_drop/reading/visio_acoustic/writing_challenges/mental_agility/closing_exam/grammar_guides/listening/icebreaker, and title is required" },
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
    console.error("[Error] PUT /api/admin/lessons:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a lesson by ID
 * 
 * Query Parameters:
 *   - id (required): ID of the lesson to delete
 * 
 * @param {NextRequest} request - HTTP request with query parameters
 * @returns {NextResponse} Success message, or error with 400/500 status
 */
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
    console.error("[Error] DELETE /api/admin/lessons:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
