/**
 * VIDEO CONTENTS API ROUTE
 * 
 * Handles creation and management of video lesson content.
 * Video content includes URL, description, and duration tracking for video lessons.
 * Validates that lessons are of type "video" before content creation.
 * 
 * Endpoints:
 * - POST /api/admin/video-contents - Create video content for a lesson
 * - GET /api/admin/video-contents - Retrieve video contents (optional: filtered by lesson)
 * - PUT /api/admin/video-contents - Update video content
 * - DELETE /api/admin/video-contents?id=... - Delete video content
 * 
 * @module api/admin/video-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create video content for a lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - lesson_id (number, required): ID of the parent video lesson
 *   - url (string, required): Video URL or source identifier
 *   - description (string, optional): Video transcript or description
 * 
 * @returns {NextResponse} Created video content object with 201 status, or error with 400/404/500 status
 *   - 404: Lesson not found
 *   - 400: Lesson is not a video type
 */
export async function POST(request: NextRequest) {
  try {
    const { lesson_id, url, description } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !url) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer and url is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "video") {
      return NextResponse.json({ error: "Selected lesson is not a video lesson" }, { status: 400 });
    }

    const videoContent = await prisma.video_contents.create({
      data: {
        lesson_id: lessonId,
        url,
        description,
      },
    });

    return NextResponse.json(videoContent, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/video-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create video content" },
      { status: 500 }
    );
  }
}
