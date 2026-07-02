/**
 * READING CONTENTS LIST API ROUTE
 * 
 * Specialized endpoint for retrieving reading content with associated glossary items.
 * Provides efficient batch retrieval of reading material with vocabulary definitions.
 * 
 * Endpoints:
 * - GET /api/admin/reading-contents/list?lessonId=... - Get reading content with glossary
 * 
 * @module api/admin/reading-contents/list
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler - Retrieve reading content with glossary items for a lesson
 * 
 * Query Parameters:
 *   - lessonId (required): ID of the reading lesson
 * 
 * @param {NextRequest} request - HTTP request with required lessonId query parameter
 * @returns {NextResponse} Array of reading content objects with nested glossary_items, or error with 400/500 status
 *   - 400: Missing or invalid lessonId parameter
 */
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
    console.error("[Error] GET /api/admin/reading-contents/list:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
