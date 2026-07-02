/**
 * FLASHCARD CONTENTS API ROUTE
 * 
 * Handles creation and management of flashcard lesson content.
 * Flashcards support spaced repetition learning with image, text, and pronunciation.
 * Validates that lessons are of type "flashcards" before content creation.
 * 
 * Endpoints:
 * - POST /api/admin/flashcard-contents - Create flashcard for a lesson
 * - GET /api/admin/flashcard-contents - Retrieve flashcards (optional: filtered by lesson)
 * - PUT /api/admin/flashcard-contents - Update flashcard content
 * - DELETE /api/admin/flashcard-contents?id=... - Delete flashcard
 * 
 * @module api/admin/flashcard-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create flashcard content for a lesson
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - lesson_id (number, required): ID of the parent flashcards lesson
 *   - front_image (string, optional): URL to card front image
 *   - back_title (string, required): Text/word on card back (vocabulary to learn)
 *   - back_pronunciation (string, optional): Phonetic pronunciation guide
 *   - lang (string, required): Language code (e.g., "es", "fr", "ja")
 * 
 * @returns {NextResponse} Created flashcard object with 201 status, or error with 400/404/500 status
 *   - 404: Lesson not found
 *   - 400: Lesson is not a flashcards type
 */
export async function POST(request: NextRequest) {
  try {
    const {
      lesson_id,
      front_image,
      back_title,
      back_pronunciation,
      lang,
    } = await request.json();
    const lessonId = Number(lesson_id);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !back_title || !lang) {
      return NextResponse.json(
        { error: "lesson_id must be a valid integer, back_title, and lang are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({ where: { id: lessonId } });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.type !== "flashcards") {
      return NextResponse.json({ error: "Selected lesson is not a flashcards lesson" }, { status: 400 });
    }

    const flashcardContent = await prisma.flashcard_contents.create({
      data: {
        lesson_id: lessonId,
        front_image,
        back_title,
        back_pronunciation,
        lang,
      },
    });

    return NextResponse.json(flashcardContent, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/flashcard-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create flashcard content" },
      { status: 500 }
    );
  }
}
