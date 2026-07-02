/**
 * @module /api/admin/writing-challenges
 * 
 * Writing Challenge Content Management API
 * 
 * Handles CRUD operations for writing expression challenges associated with lessons.
 * Writing challenges are text composition exercises where students write using learned vocabulary.
 * 
 * Supported Operations:
 * - POST: Create a new writing challenge
 * - GET: Retrieve writing challenges (with optional lesson filtering)
 * - PUT: Update an existing writing challenge
 * - DELETE: Remove a writing challenge
 * 
 * All endpoints include validation, error handling, and timestamp logging.
 * @author MaltTalk Team
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/writing-challenges
 * 
 * Creates a new writing challenge associated with a lesson.
 * Validates that the lesson exists and is of type "writing_challenges".
 * 
 * @async
 * @param {Request} request - HTTP request with JSON body
 * @returns {Promise<Response>} JSON response with created challenge or error
 * @status 200 - Challenge created successfully
 * @status 400 - Missing/invalid parameters or lesson type mismatch
 * @status 500 - Database error
 * 
 * @example
 * POST /api/admin/writing-challenges
 * {
 *   "lesson_id": 6,
 *   "title": "Write a greeting email",
 *   "prompt": "Write a professional email greeting...",
 *   "min_words": 50,
 *   "max_words": 300,
 *   "required_vocabulary": "hello, greetings, pleased",
 *   "difficulty_level": "beginner",
 *   "hint": "Start with a salutation"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lesson_id,
      title,
      prompt,
      min_words,
      max_words,
      required_vocabulary,
      example_answer,
      difficulty_level,
      challenge_order,
      evaluation_criteria,
      hint,
    } = body;

    // Validate required parameters
    if (!lesson_id || !title || !prompt) {
      return NextResponse.json(
        { error: "lesson_id, title, and prompt are required" },
        { status: 400 }
      );
    }

    // Verify lesson exists and is of type writing_challenges
    const lesson = await prisma.lessons.findUnique({
      where: { id: lesson_id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 400 }
      );
    }

    if (lesson.type !== "writing_challenges") {
      return NextResponse.json(
        { error: `Lesson type must be 'writing_challenges', got '${lesson.type}'` },
        { status: 400 }
      );
    }

    // Create the writing challenge
    const writingChallenge = await prisma.writing_challenge_contents.create({
      data: {
        lesson_id,
        title: title.trim(),
        prompt: prompt.trim(),
        min_words: min_words || 50,
        max_words: max_words || 300,
        required_vocabulary: required_vocabulary || null,
        example_answer: example_answer || null,
        difficulty_level: difficulty_level || "beginner",
        challenge_order: challenge_order || 0,
        evaluation_criteria: evaluation_criteria || null,
        hint: hint || null,
      },
    });

    console.log(`[Success] POST /api/admin/writing-challenges - Challenge ${writingChallenge.id} created at ${new Date().toISOString()}`);
    return NextResponse.json(writingChallenge, { status: 200 });
  } catch (error) {
    console.error(`[Error] POST /api/admin/writing-challenges`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create writing challenge" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/writing-challenges
 * 
 * Retrieves all writing challenges, optionally filtered by lesson_id.
 * Results are ordered by challenge_order for consistent presentation.
 * 
 * @async
 * @param {Request} request - HTTP request with optional query parameters
 * @returns {Promise<Response>} JSON array of writing challenges
 * @status 200 - Challenges retrieved successfully
 * @status 500 - Database error
 * 
 * @queryParam {number} [lesson_id] - Optional lesson ID to filter challenges
 * 
 * @example
 * GET /api/admin/writing-challenges?lesson_id=6
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const challenges = await prisma.writing_challenge_contents.findMany({
      where: lessonId ? { lesson_id: Number(lessonId) } : undefined,
      orderBy: { challenge_order: "asc" },
    });

    console.log(`[Success] GET /api/admin/writing-challenges - Retrieved ${challenges.length} challenges at ${new Date().toISOString()}`);
    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error(`[Error] GET /api/admin/writing-challenges`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to retrieve writing challenges" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/writing-challenges
 * 
 * Updates an existing writing challenge with partial data.
 * All fields are optional - only provided fields will be updated.
 * 
 * @async
 * @param {Request} request - HTTP request with JSON body
 * @returns {Promise<Response>} JSON response with updated challenge or error
 * @status 200 - Challenge updated successfully
 * @status 400 - Missing challenge_id or challenge not found
 * @status 500 - Database error
 * 
 * @example
 * PUT /api/admin/writing-challenges
 * {
 *   "challenge_id": 5,
 *   "title": "Updated title",
 *   "min_words": 75
 * }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { challenge_id, ...updateData } = body;

    if (!challenge_id) {
      return NextResponse.json(
        { error: "challenge_id is required" },
        { status: 400 }
      );
    }

    // Build update object, excluding undefined values
    const updatePayload: Record<string, any> = {};
    if (updateData.title !== undefined) updatePayload.title = updateData.title.trim();
    if (updateData.prompt !== undefined) updatePayload.prompt = updateData.prompt.trim();
    if (updateData.min_words !== undefined) updatePayload.min_words = updateData.min_words;
    if (updateData.max_words !== undefined) updatePayload.max_words = updateData.max_words;
    if (updateData.required_vocabulary !== undefined) updatePayload.required_vocabulary = updateData.required_vocabulary;
    if (updateData.example_answer !== undefined) updatePayload.example_answer = updateData.example_answer;
    if (updateData.difficulty_level !== undefined) updatePayload.difficulty_level = updateData.difficulty_level;
    if (updateData.challenge_order !== undefined) updatePayload.challenge_order = updateData.challenge_order;
    if (updateData.evaluation_criteria !== undefined) updatePayload.evaluation_criteria = updateData.evaluation_criteria;
    if (updateData.hint !== undefined) updatePayload.hint = updateData.hint;

    const updatedChallenge = await prisma.writing_challenge_contents.update({
      where: { id: challenge_id },
      data: updatePayload,
    });

    console.log(`[Success] PUT /api/admin/writing-challenges - Challenge ${challenge_id} updated at ${new Date().toISOString()}`);
    return NextResponse.json(updatedChallenge, { status: 200 });
  } catch (error) {
    console.error(`[Error] PUT /api/admin/writing-challenges`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update writing challenge" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/writing-challenges
 * 
 * Deletes a writing challenge by ID.
 * 
 * @async
 * @param {Request} request - HTTP request with JSON body
 * @returns {Promise<Response>} JSON response confirming deletion
 * @status 200 - Challenge deleted successfully
 * @status 400 - Missing challenge_id
 * @status 500 - Database error
 * 
 * @example
 * DELETE /api/admin/writing-challenges
 * { "challenge_id": 5 }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { challenge_id } = body;

    if (!challenge_id) {
      return NextResponse.json(
        { error: "challenge_id is required" },
        { status: 400 }
      );
    }

    await prisma.writing_challenge_contents.delete({
      where: { id: challenge_id },
    });

    console.log(`[Success] DELETE /api/admin/writing-challenges - Challenge ${challenge_id} deleted at ${new Date().toISOString()}`);
    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`[Error] DELETE /api/admin/writing-challenges`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete writing challenge" },
      { status: 500 }
    );
  }
}
