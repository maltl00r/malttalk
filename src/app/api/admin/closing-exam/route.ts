/**
 * @module /api/admin/closing-exam
 * 
 * Closing Exam Content Management API
 * 
 * Handles CRUD operations for unit closing assessments associated with lessons.
 * Closing exams are timed tests at the end of learning units to measure comprehension.
 * 
 * Supported Operations:
 * - POST: Create a new closing exam question
 * - GET: Retrieve closing exam questions (with optional lesson filtering)
 * - PUT: Update an existing closing exam question
 * - DELETE: Remove a closing exam question
 * 
 * All endpoints include validation, error handling, and timestamp logging.
 * @author MaltTalk Team
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/closing-exam
 * Creates a new closing exam question associated with a lesson.
 * Validates that the lesson exists and is of type "closing_exam".
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lesson_id,
      title,
      description,
      time_limit,
      question,
      correct_answer,
      option_b,
      option_c,
      option_d,
      passing_score,
      difficulty_level,
      question_order,
      points_value,
      feedback_correct,
      feedback_incorrect,
    } = body;

    if (!lesson_id || !title || !question || !correct_answer || !option_b || !option_c) {
      return NextResponse.json(
        { error: "lesson_id, title, question, correct_answer, option_b, and option_c are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lessons.findUnique({
      where: { id: lesson_id },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 400 });
    }

    if (lesson.type !== "closing_exam") {
      return NextResponse.json(
        { error: `Lesson type must be 'closing_exam', got '${lesson.type}'` },
        { status: 400 }
      );
    }

    const exam = await prisma.closing_exam_contents.create({
      data: {
        lesson_id,
        title: title.trim(),
        description: description || null,
        time_limit: time_limit || 600,
        question: question.trim(),
        correct_answer: correct_answer.trim(),
        option_b: option_b.trim(),
        option_c: option_c.trim(),
        option_d: option_d ? option_d.trim() : null,
        passing_score: passing_score || 70,
        difficulty_level: difficulty_level || "beginner",
        question_order: question_order || 0,
        points_value: points_value || 1,
        feedback_correct: feedback_correct || null,
        feedback_incorrect: feedback_incorrect || null,
      },
    });

    console.log(`[Success] POST /api/admin/closing-exam - Question ${exam.id} created at ${new Date().toISOString()}`);
    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error(`[Error] POST /api/admin/closing-exam`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create closing exam question" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/closing-exam
 * Retrieves all closing exam questions, optionally filtered by lesson_id.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const questions = await prisma.closing_exam_contents.findMany({
      where: lessonId ? { lesson_id: Number(lessonId) } : undefined,
      orderBy: { question_order: "asc" },
    });

    console.log(`[Success] GET /api/admin/closing-exam - Retrieved ${questions.length} questions at ${new Date().toISOString()}`);
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error(`[Error] GET /api/admin/closing-exam`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to retrieve closing exam questions" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/closing-exam
 * Updates an existing closing exam question with partial data.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { question_id, ...updateData } = body;

    if (!question_id) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {};
    if (updateData.title !== undefined) updatePayload.title = updateData.title.trim();
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.time_limit !== undefined) updatePayload.time_limit = updateData.time_limit;
    if (updateData.question !== undefined) updatePayload.question = updateData.question.trim();
    if (updateData.correct_answer !== undefined) updatePayload.correct_answer = updateData.correct_answer.trim();
    if (updateData.option_b !== undefined) updatePayload.option_b = updateData.option_b.trim();
    if (updateData.option_c !== undefined) updatePayload.option_c = updateData.option_c.trim();
    if (updateData.option_d !== undefined) updatePayload.option_d = updateData.option_d;
    if (updateData.passing_score !== undefined) updatePayload.passing_score = updateData.passing_score;
    if (updateData.difficulty_level !== undefined) updatePayload.difficulty_level = updateData.difficulty_level;
    if (updateData.question_order !== undefined) updatePayload.question_order = updateData.question_order;
    if (updateData.points_value !== undefined) updatePayload.points_value = updateData.points_value;
    if (updateData.feedback_correct !== undefined) updatePayload.feedback_correct = updateData.feedback_correct;
    if (updateData.feedback_incorrect !== undefined) updatePayload.feedback_incorrect = updateData.feedback_incorrect;

    const updated = await prisma.closing_exam_contents.update({
      where: { id: question_id },
      data: updatePayload,
    });

    console.log(`[Success] PUT /api/admin/closing-exam - Question ${question_id} updated at ${new Date().toISOString()}`);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(`[Error] PUT /api/admin/closing-exam`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update closing exam question" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/closing-exam
 * Deletes a closing exam question by ID.
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { question_id } = body;

    if (!question_id) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }

    await prisma.closing_exam_contents.delete({
      where: { id: question_id },
    });

    console.log(`[Success] DELETE /api/admin/closing-exam - Question ${question_id} deleted at ${new Date().toISOString()}`);
    return NextResponse.json({ message: "Question deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`[Error] DELETE /api/admin/closing-exam`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete closing exam question" },
      { status: 500 }
    );
  }
}
