/**
 * VISIO-ACOUSTIC CONTENTS API ROUTE
 * 
 * Handles CRUD operations for visio-acoustic diagnostic quiz content.
 * Visio-acoustic quizzes test student comprehension by associating sounds
 * (audio/pronunciation) with visual elements (gestures, images).
 * 
 * Endpoints:
 * - POST /api/admin/visio-acoustic-contents - Create visio-acoustic question
 * - GET /api/admin/visio-acoustic-contents - Retrieve questions (optional: filtered by lesson)
 * - PUT /api/admin/visio-acoustic-contents - Update question
 * - DELETE /api/admin/visio-acoustic-contents?id=... - Delete question
 * 
 * @module api/admin/visio-acoustic-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create visio-acoustic quiz question
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - lesson_id (number, required): ID of the parent visio-acoustic lesson
 *   - question_text (string, required): Question prompt (e.g., "Choose the gesture for...")
 *   - sound_url (string, required): URL to audio file
 *   - image_url (string, required): URL to gesture or image visual reference
 *   - correct_answer (string, required): Text of correct answer option
 *   - option_b (string, required): Second answer option
 *   - option_c (string, required): Third answer option
 *   - option_d (string, optional): Fourth answer option
 *   - feedback_correct (string, optional): Positive feedback for correct answer
 *   - feedback_incorrect (string, optional): Feedback for incorrect answers
 *   - question_order (number, optional): Question order within lesson (default: 0)
 *   - difficulty_level (string, optional): beginner|intermediate|advanced (default: beginner)
 * 
 * @returns {NextResponse} Created question object with 201 status, or error with 400/404/500 status
 *   - 404: Lesson not found
 *   - 400: Lesson is not a visio-acoustic type
 */
export async function POST(request: NextRequest) {
  try {
    const {
      lesson_id,
      question_text,
      sound_url,
      image_url,
      correct_answer,
      option_b,
      option_c,
      option_d,
      feedback_correct,
      feedback_incorrect,
      question_order,
      difficulty_level,
    } = await request.json();

    const lessonId = Number(lesson_id);

    // Validate required fields
    if (
      !Number.isInteger(lessonId) ||
      lessonId <= 0 ||
      !question_text ||
      !sound_url ||
      !image_url ||
      !correct_answer ||
      !option_b ||
      !option_c
    ) {
      return NextResponse.json(
        {
          error:
            "lesson_id must be a valid integer, and question_text, sound_url, image_url, correct_answer, option_b, option_c are required",
        },
        { status: 400 }
      );
    }

    // Verify lesson exists and is visio-acoustic type
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    if (lesson.type !== "visio_acoustic") {
      return NextResponse.json(
        { error: "Selected lesson is not a visio-acoustic lesson" },
        { status: 400 }
      );
    }

    // Create visio-acoustic content
    const content = await prisma.visio_acoustic_contents.create({
      data: {
        lesson_id: lessonId,
        question_text,
        sound_url,
        image_url,
        correct_answer,
        option_b,
        option_c,
        option_d,
        feedback_correct,
        feedback_incorrect,
        question_order: question_order || 0,
        difficulty_level: difficulty_level || "beginner",
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/visio-acoustic-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create visio-acoustic content" },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Retrieve visio-acoustic quiz questions
 * 
 * Query Parameters:
 *   - lessonId (optional): Filter questions by lesson ID
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of questions sorted by question_order, or error with 500 status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    const contents = await prisma.visio_acoustic_contents.findMany({
      where: lessonId ? { lesson_id: Number(lessonId) } : undefined,
      orderBy: { question_order: "asc" },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("[Error] GET /api/admin/visio-acoustic-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch visio-acoustic contents" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update a visio-acoustic quiz question
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - id (number, required): ID of the question to update
 *   - question_text (string, optional): Updated question text
 *   - sound_url (string, optional): Updated sound URL
 *   - image_url (string, optional): Updated image URL
 *   - correct_answer (string, optional): Updated correct answer
 *   - option_b (string, optional): Updated option B
 *   - option_c (string, optional): Updated option C
 *   - option_d (string, optional): Updated option D
 *   - feedback_correct (string, optional): Updated positive feedback
 *   - feedback_incorrect (string, optional): Updated incorrect feedback
 *   - question_order (number, optional): Updated question order
 *   - difficulty_level (string, optional): Updated difficulty level
 * 
 * @returns {NextResponse} Updated question object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      question_text,
      sound_url,
      image_url,
      correct_answer,
      option_b,
      option_c,
      option_d,
      feedback_correct,
      feedback_incorrect,
      question_order,
      difficulty_level,
    } = await request.json();

    const contentId = Number(id);

    if (!Number.isInteger(contentId) || contentId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (question_text !== undefined) updateData.question_text = question_text;
    if (sound_url !== undefined) updateData.sound_url = sound_url;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (correct_answer !== undefined) updateData.correct_answer = correct_answer;
    if (option_b !== undefined) updateData.option_b = option_b;
    if (option_c !== undefined) updateData.option_c = option_c;
    if (option_d !== undefined) updateData.option_d = option_d;
    if (feedback_correct !== undefined) updateData.feedback_correct = feedback_correct;
    if (feedback_incorrect !== undefined) updateData.feedback_incorrect = feedback_incorrect;
    if (question_order !== undefined) updateData.question_order = question_order;
    if (difficulty_level !== undefined) updateData.difficulty_level = difficulty_level;

    const content = await prisma.visio_acoustic_contents.update({
      where: { id: contentId },
      data: updateData,
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("[Error] PUT /api/admin/visio-acoustic-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update visio-acoustic content" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a visio-acoustic quiz question
 * 
 * Query Parameters:
 *   - id (required): ID of the question to delete
 * 
 * @param {NextRequest} request - HTTP request with query parameters
 * @returns {NextResponse} Success message, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const contentId = Number(id);

    if (!Number.isInteger(contentId) || contentId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.visio_acoustic_contents.delete({
      where: { id: contentId },
    });

    return NextResponse.json({ message: "Visio-acoustic content deleted successfully" });
  } catch (error) {
    console.error("[Error] DELETE /api/admin/visio-acoustic-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete visio-acoustic content" },
      { status: 500 }
    );
  }
}
