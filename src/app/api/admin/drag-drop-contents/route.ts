/**
 * DRAG-DROP CONTENTS API ROUTE
 * 
 * Handles creation and management of interactive drag-and-drop exercise content.
 * Drag-drop exercises enable interactive categorization and matching activities.
 * Validates that lessons are of type "drag_drop" before content creation.
 * 
 * Endpoints:
 * - POST /api/admin/drag-drop-contents - Create drag-drop exercise for a lesson
 * - GET /api/admin/drag-drop-contents - Retrieve exercises (optional: filtered by lesson)
 * - PUT /api/admin/drag-drop-contents - Update exercise
 * - DELETE /api/admin/drag-drop-contents?id=... - Delete exercise
 * 
 * @module api/admin/drag-drop-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create drag-drop exercise for a lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - lesson_id (number, required): ID of the parent drag-drop lesson
 *   - text (string, required): Item text to be dragged
 *   - category (string, required): Target category for the item
 *   - feedback_message_wrong (string, optional): Custom error message for incorrect placement
 * 
 * @returns {NextResponse} Created exercise object with 201 status, or error with 400/404/500 status
 *   - 404: Lesson not found
 *   - 400: Lesson is not a drag_drop type
 */
export async function POST(request: NextRequest) {
  try {
    const { lesson_id, text, category, feedback_message_wrong } =
      await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !text || !category) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer, text, and category are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "drag_drop") {
      return NextResponse.json({ error: "Selected lesson is not a drag-drop lesson" }, { status: 400 });
    }

    const dragDropContent = await prisma.drag_drop_contents.create({
      data: {
        lesson_id: lessonId,
        text,
        category,
        feedback_message_wrong,
      },
    });

    return NextResponse.json(dragDropContent, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/drag-drop-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create drag-drop content" },
      { status: 500 }
    );
  }
}
