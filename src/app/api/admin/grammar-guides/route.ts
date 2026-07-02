/**
 * GRAMMAR GUIDES ADMIN API ROUTE
 * 
 * CRUD operations for grammar guide lesson content.
 * Manages sentence structure guides with color-coded visual schemas.
 * 
 * Endpoints:
 * - POST /api/admin/grammar-guides - Create new grammar guide
 * - GET /api/admin/grammar-guides - List all grammar guides (optionally filtered by lesson_id)
 * - PUT /api/admin/grammar-guides - Update existing grammar guide
 * - DELETE /api/admin/grammar-guides - Delete grammar guide by ID
 * 
 * @module api/admin/grammar-guides
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create new grammar guide
 * 
 * Validates that the referenced lesson exists and has type "grammar_guides"
 * 
 * @param {NextRequest} request - HTTP request with JSON body
 * @returns {NextResponse} Created guide object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lesson_id, title, description, structure_schema, example_sentences, image_url, difficulty_level, guide_order } = body;

    // Validate required fields
    if (!lesson_id || !title || !structure_schema) {
      return NextResponse.json(
        { error: "Missing required fields: lesson_id, title, structure_schema" },
        { status: 400 }
      );
    }

    // Verify lesson exists and has type "grammar_guides"
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

    if (lesson.type !== "grammar_guides") {
      return NextResponse.json(
        { error: "Lesson type must be 'grammar_guides'" },
        { status: 400 }
      );
    }

    const guide = await prisma.grammar_guides_contents.create({
      data: {
        lesson_id,
        title,
        description: description || null,
        structure_schema,
        example_sentences,
        image_url: image_url || null,
        difficulty_level: difficulty_level || "beginner",
        guide_order: guide_order || 0,
      },
    });

    return NextResponse.json(guide, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/grammar-guides:", {
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
 * GET handler - List all grammar guides
 * 
 * Optional query parameter:
 * - lesson_id: Filter guides by specific lesson
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of grammar guides, or error with 500 status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson_id");

    const where = lessonId ? { lesson_id: parseInt(lessonId) } : {};

    const guides = await prisma.grammar_guides_contents.findMany({
      where,
      orderBy: { guide_order: "asc" },
    });

    return NextResponse.json({ count: guides.length, guides });
  } catch (error) {
    console.error("[Error] GET /api/admin/grammar-guides:", {
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
 * PUT handler - Update existing grammar guide
 * 
 * Updates one or more fields of a grammar guide.
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing id and update fields
 * @returns {NextResponse} Updated guide object, or error with 400/500 status
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

    const guide = await prisma.grammar_guides_contents.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(guide);
  } catch (error) {
    console.error("[Error] PUT /api/admin/grammar-guides:", {
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
 * DELETE handler - Delete grammar guide by ID
 * 
 * @param {NextRequest} request - HTTP request with guide ID in query or body
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

    await prisma.grammar_guides_contents.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Grammar guide deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Error] DELETE /api/admin/grammar-guides:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
