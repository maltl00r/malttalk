/**
 * ICEBREAKER CONTENTS ADMIN API ROUTE
 * 
 * CRUD operations for icebreaker dynamics lesson content.
 * Manages expression-illustration matching exercises for real-world communication.
 * 
 * Endpoints:
 * - POST /api/admin/icebreaker-contents - Create new icebreaker expression
 * - GET /api/admin/icebreaker-contents - List all icebreaker expressions (optionally filtered by lesson_id)
 * - PUT /api/admin/icebreaker-contents - Update existing icebreaker expression
 * - DELETE /api/admin/icebreaker-contents - Delete icebreaker expression by ID
 * 
 * @module api/admin/icebreaker-contents
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create new icebreaker expression
 * 
 * Validates that the referenced lesson exists and has type "icebreaker"
 * 
 * @param {NextRequest} request - HTTP request with JSON body
 * @returns {NextResponse} Created expression object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lesson_id, title, description, expression, illustration_url, situation_description, pair_id, difficulty_level, pair_order } = body;

    // Validate required fields
    if (!lesson_id || !title || !expression || !illustration_url || !situation_description) {
      return NextResponse.json(
        { error: "Missing required fields: lesson_id, title, expression, illustration_url, situation_description" },
        { status: 400 }
      );
    }

    // Verify lesson exists and has type "icebreaker"
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

    if (lesson.type !== "icebreaker") {
      return NextResponse.json(
        { error: "Lesson type must be 'icebreaker'" },
        { status: 400 }
      );
    }

    const icebreaker = await prisma.icebreaker_contents.create({
      data: {
        lesson_id,
        title,
        description: description || null,
        expression,
        illustration_url,
        situation_description,
        pair_id: pair_id || null,
        difficulty_level: difficulty_level || "beginner",
        pair_order: pair_order || 0,
      },
    });

    return NextResponse.json(icebreaker, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/icebreaker-contents:", {
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
 * GET handler - List all icebreaker expressions
 * 
 * Optional query parameter:
 * - lesson_id: Filter expressions by specific lesson
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of icebreaker expressions, or error with 500 status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const where = lessonId ? { lesson_id: parseInt(lessonId) } : {};

    const expressions = await prisma.icebreaker_contents.findMany({
      where,
      orderBy: { pair_order: "asc" },
    });

    return NextResponse.json({ count: expressions.length, expressions });
  } catch (error) {
    console.error("[Error] GET /api/admin/icebreaker-contents:", {
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
 * PUT handler - Update existing icebreaker expression
 * 
 * Updates one or more fields of an icebreaker expression.
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing id and update fields
 * @returns {NextResponse} Updated expression object, or error with 400/500 status
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

    const icebreaker = await prisma.icebreaker_contents.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(icebreaker);
  } catch (error) {
    console.error("[Error] PUT /api/admin/icebreaker-contents:", {
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
 * DELETE handler - Delete icebreaker expression by ID
 * 
 * @param {NextRequest} request - HTTP request with expression ID in query or body
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

    await prisma.icebreaker_contents.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Icebreaker expression deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Error] DELETE /api/admin/icebreaker-contents:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
