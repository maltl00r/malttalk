/**
 * READING CONTENTS API ROUTE
 * 
 * Handles creation and management of reading comprehension lesson content.
 * Reading content includes the full text material that students study.
 * Supports interactive glossary for vocabulary definitions.
 * Validates that lessons are of type "reading" before content creation.
 * 
 * Endpoints:
 * - POST /api/admin/reading-contents - Create reading content for a lesson
 * - GET /api/admin/reading-contents - Retrieve reading content (optional: filtered by lesson)
 * - PUT /api/admin/reading-contents - Update reading content
 * - DELETE /api/admin/reading-contents?id=... - Delete reading content
 * 
 * @module api/admin/reading-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create reading content for a lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - lesson_id (number, required): ID of the parent reading lesson
 *   - text (string, required): Full reading material/article text
 * 
 * @returns {NextResponse} Created reading content object with 201 status, or error with 400/404/500 status
 *   - 404: Lesson not found
 *   - 400: Lesson is not a reading type
 */
export async function POST(request: NextRequest) {
  try {
    const { lesson_id, text } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !text) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer and text is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "reading") {
      return NextResponse.json({ error: "Selected lesson is not a reading lesson" }, { status: 400 });
    }

    const readingContent = await prisma.reading_contents.create({
      data: {
        lesson_id: lessonId,
        text,
      },
    });

    return NextResponse.json(readingContent, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/reading-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create reading content" },
      { status: 500 }
    );
  }
}
