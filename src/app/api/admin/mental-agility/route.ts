/**
 * @module /api/admin/mental-agility
 * 
 * Mental Agility Challenge Content Management API
 * 
 * Handles CRUD operations for timed mental agility challenges associated with lessons.
 * These are speed-based challenges where students identify correct terms or patterns.
 * 
 * Supported Operations:
 * - POST: Create a new mental agility challenge
 * - GET: Retrieve mental agility challenges (with optional lesson filtering)
 * - PUT: Update an existing mental agility challenge
 * - DELETE: Remove a mental agility challenge
 * 
 * All endpoints include validation, error handling, and timestamp logging.
 * @author MaltTalk Team
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/mental-agility
 * Creates a new mental agility challenge associated with a lesson.
 * Validates that the lesson exists and is of type "mental_agility".
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lesson_id,
      title,
      prompt,
      time_limit,
      correct_answer,
      option_b,
      option_c,
      option_d,
      image_url,
      feedback_correct,
      feedback_incorrect,
      difficulty_level,
      challenge_order,
      challenge_type,
    } = body;

    if (!lesson_id || !title || !prompt || !correct_answer || !option_b || !option_c) {
      return NextResponse.json(
        { error: "lesson_id, title, prompt, correct_answer, option_b, and option_c are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({
      where: { id: lesson_id },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 400 });
    }

    if (lesson.type !== "mental_agility") {
      return NextResponse.json(
        { error: `Lesson type must be 'mental_agility', got '${lesson.type}'` },
        { status: 400 }
      );
    }

    const challenge = await prisma.mental_agility_contents.create({
      data: {
        lesson_id,
        title: title.trim(),
        prompt: prompt.trim(),
        time_limit: time_limit || 30,
        correct_answer: correct_answer.trim(),
        option_b: option_b.trim(),
        option_c: option_c.trim(),
        option_d: option_d ? option_d.trim() : null,
        image_url: image_url || null,
        feedback_correct: feedback_correct || null,
        feedback_incorrect: feedback_incorrect || null,
        difficulty_level: difficulty_level || "beginner",
        challenge_order: challenge_order || 0,
        challenge_type: challenge_type || null,
      },
    });

    console.log(`[Success] POST /api/admin/mental-agility - Challenge ${challenge.id} created at ${new Date().toISOString()}`);
    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error(`[Error] POST /api/admin/mental-agility`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create mental agility challenge" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/mental-agility
 * Retrieves all mental agility challenges, optionally filtered by lesson_id.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const challenges = await prisma.mental_agility_contents.findMany({
      where: lessonId ? { lesson_id: Number(lessonId) } : undefined,
      orderBy: { challenge_order: "asc" },
    });

    console.log(`[Success] GET /api/admin/mental-agility - Retrieved ${challenges.length} challenges at ${new Date().toISOString()}`);
    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error(`[Error] GET /api/admin/mental-agility`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to retrieve mental agility challenges" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/mental-agility
 * Updates an existing mental agility challenge with partial data.
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

    const updatePayload: Record<string, any> = {};
    if (updateData.title !== undefined) updatePayload.title = updateData.title.trim();
    if (updateData.prompt !== undefined) updatePayload.prompt = updateData.prompt.trim();
    if (updateData.time_limit !== undefined) updatePayload.time_limit = updateData.time_limit;
    if (updateData.correct_answer !== undefined) updatePayload.correct_answer = updateData.correct_answer.trim();
    if (updateData.option_b !== undefined) updatePayload.option_b = updateData.option_b.trim();
    if (updateData.option_c !== undefined) updatePayload.option_c = updateData.option_c.trim();
    if (updateData.option_d !== undefined) updatePayload.option_d = updateData.option_d;
    if (updateData.image_url !== undefined) updatePayload.image_url = updateData.image_url;
    if (updateData.feedback_correct !== undefined) updatePayload.feedback_correct = updateData.feedback_correct;
    if (updateData.feedback_incorrect !== undefined) updatePayload.feedback_incorrect = updateData.feedback_incorrect;
    if (updateData.difficulty_level !== undefined) updatePayload.difficulty_level = updateData.difficulty_level;
    if (updateData.challenge_order !== undefined) updatePayload.challenge_order = updateData.challenge_order;
    if (updateData.challenge_type !== undefined) updatePayload.challenge_type = updateData.challenge_type;

    const updated = await prisma.mental_agility_contents.update({
      where: { id: challenge_id },
      data: updatePayload,
    });

    console.log(`[Success] PUT /api/admin/mental-agility - Challenge ${challenge_id} updated at ${new Date().toISOString()}`);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(`[Error] PUT /api/admin/mental-agility`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update mental agility challenge" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/mental-agility
 * Deletes a mental agility challenge by ID.
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

    await prisma.mental_agility_contents.delete({
      where: { id: challenge_id },
    });

    console.log(`[Success] DELETE /api/admin/mental-agility - Challenge ${challenge_id} deleted at ${new Date().toISOString()}`);
    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`[Error] DELETE /api/admin/mental-agility`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete mental agility challenge" },
      { status: 500 }
    );
  }
}
