/**
 * LISTENING CONTENTS ADMIN API ROUTE
 * 
 * CRUD operations for listening comprehension lesson content.
 * Manages audio exercises with image-based answer selection.
 * 
 * Endpoints:
 * - POST /api/admin/listening-contents - Create new listening exercise
 * - GET /api/admin/listening-contents - List all listening exercises (optionally filtered by lesson_id)
 * - PUT /api/admin/listening-contents - Update existing listening exercise
 * - DELETE /api/admin/listening-contents - Delete listening exercise by ID
 * 
 * @module api/admin/listening-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create new listening exercise
 * 
 * Validates that the referenced lesson exists and has type "listening"
 * 
 * @param {NextRequest} request - HTTP request with JSON body
 * @returns {NextResponse} Created exercise object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lesson_id, title, description, question, audio_url, image_options, correct_answer, feedback_correct, feedback_incorrect, difficulty_level, question_order } = body;

    // Validate required fields
    if (!lesson_id || !title || !audio_url || !image_options || correct_answer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: lesson_id, title, audio_url, image_options, correct_answer" },
        { status: 400 }
      );
    }

    // Verify lesson exists and has type "listening"
    const lesson = await prisma.lessons.findUnique({
      where: { id: lesson_id },
      select: { id: true, type: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 400 }
      );
    }

    if (lesson.type !== "listening") {
      return NextResponse.json(
        { error: "Lesson type must be 'listening'" },
        { status: 400 }
      );
    }

    const exercise = await prisma.listening_contents.create({
      data: {
        lesson_id,
        title,
        description: description || null,
        question: question || "¿Qué escuchas?",
        audio_url,
        image_options: JSON.stringify(image_options),
        correct_answer,
        feedback_correct: feedback_correct || null,
        feedback_incorrect: feedback_incorrect || null,
        difficulty_level: difficulty_level || "beginner",
        question_order: question_order || 0,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/listening-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET handler - List all listening exercises
 * 
 * Optional query parameter:
 * - lesson_id: Filter exercises by specific lesson
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of listening exercises, or error with 500 status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const where = lessonId ? { lesson_id: parseInt(lessonId) } : {};

    const exercises = await prisma.listening_contents.findMany({
      where,
      orderBy: { question_order: "asc" },
    });

    return NextResponse.json({ count: exercises.length, exercises });
  } catch (error) {
    console.error("[Error] GET /api/admin/listening-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update existing listening exercise
 * 
 * Updates one or more fields of a listening exercise.
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing id and update fields
 * @returns {NextResponse} Updated exercise object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const exercise = await prisma.listening_contents.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("[Error] PUT /api/admin/listening-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete listening exercise by ID
 * 
 * @param {NextRequest} request - HTTP request with exercise ID in query or body
 * @returns {NextResponse} Confirmation message, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    await prisma.listening_contents.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Listening exercise deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Error] DELETE /api/admin/listening-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
