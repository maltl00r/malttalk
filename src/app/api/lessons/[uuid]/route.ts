/**
 * PUBLIC LESSON DETAILS API ROUTE
 * 
 * Endpoint for retrieving complete lesson data by UUID.
 * Supports public sharing of lessons through UUID-based URLs.
 * Returns all lesson content types and associated metadata.
 * 
 * Route Parameters:
 * - uuid (required): UUID of the lesson
 * 
 * Endpoints:
 * - GET /api/lessons/[uuid] - Get complete lesson data by UUID
 * 
 * @module api/lessons/[uuid]
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler - Retrieve complete lesson data by UUID
 * 
 * Returns all lesson content regardless of type:
 * - Topic/course metadata
 * - Video content with duration
 * - Flashcard content with images and pronunciation
 * - Drag-drop exercise content
 * - Reading content with glossary items
 * 
 * @param {NextRequest} request - HTTP request object
 * @param {object} params - Route parameters promise containing uuid
 * @returns {NextResponse} Complete lesson object with all content types, or error with 404/500 status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const lesson = await prisma.lessons.findUnique({
      where: { uuid },
      include: {
        topics: {
          select: {
            id: true,
            slug: true,
            title: true,
            course_slug: true,
          },
        },
        video_contents: true,
        flashcard_contents: true,
        drag_drop_contents: true,
        reading_contents: {
          include: {
            glossary_items: true,
          },
        },
        visio_acoustic_contents: true,
        writing_challenge_contents: true,
        mental_agility_contents: true,
        closing_exam_contents: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[Error] GET /api/lessons/[uuid]:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
