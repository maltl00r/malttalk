/**
 * DEBUG LESSONS API ROUTE
 * 
 * Development/debugging endpoint for inspecting lesson data structure.
 * Returns a limited set (10) of lessons with minimal fields for debugging purposes.
 * Used during development to verify data relationships and lesson structure.
 * 
 * Endpoints:
 * - GET /api/debug/lessons - Get limited lesson data for debugging
 * 
 * @module api/debug/lessons
 */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET handler - Retrieve limited lesson data for debugging
 * 
 * Returns the first 10 lessons with essential metadata including:
 * - Lesson ID, UUID, title, type, and topic relationship
 * - Associated course slug from parent topic
 * 
 * @returns {NextResponse} Object with count and lessons array, or error with 500 status
 */
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
    console.error("[Error] GET /api/debug/lessons:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
