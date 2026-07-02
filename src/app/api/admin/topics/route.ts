/**
 * TOPICS API ROUTE
 * 
 * Handles CRUD operations for course topics (learning modules).
 * Topics organize lessons within courses for curriculum structure.
 * 
 * Endpoints:
 * - POST /api/admin/topics - Create a new topic
 * - GET /api/admin/topics - List topics (optionally filtered by course)
 * - PUT /api/admin/topics - Update an existing topic
 * - DELETE /api/admin/topics?id=... - Delete a topic by ID
 * 
 * @module api/admin/topics
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create a new topic
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - slug (string, required): URL-friendly identifier for the topic
 *   - title (string, required): Display name of the topic
 *   - course_slug (string, required): Slug of the parent course
 * 
 * @returns {NextResponse} Created topic object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const { slug, title, course_slug } = await request.json();

    if (!slug || !title || !course_slug) {
      return NextResponse.json(
        { error: "slug, title, and course_slug are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topics.create({
      data: {
        slug,
        title,
        course_slug,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/topics:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Retrieve topics optionally filtered by course slug
 * 
 * Query Parameters:
 *   - courseSlug (optional): Filter topics by parent course slug
 * 
 * @param {NextRequest} request - HTTP request with optional query parameters
 * @returns {NextResponse} Array of topics sorted by slug, or error with 500 status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug");

    const topics = await prisma.topics.findMany({
      where: courseSlug ? { course_slug: courseSlug } : undefined,
      orderBy: { slug: "asc" },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("[Error] GET /api/admin/topics:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update an existing topic
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - id (number, required): ID of the topic to update
 *   - slug (string, required): Updated URL-friendly identifier
 *   - title (string, required): Updated display name
 *   - course_slug (string, required): Updated parent course slug
 * 
 * @returns {NextResponse} Updated topic object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, slug, title, course_slug } = await request.json();
    const topicId = Number(id);

    if (!Number.isInteger(topicId) || topicId <= 0 || !slug || !title || !course_slug) {
      return NextResponse.json(
        { error: "id, slug, title, and course_slug are required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topics.update({
      where: { id: topicId },
      data: { slug, title, course_slug },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("[Error] PUT /api/admin/topics:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a topic by ID
 * 
 * Query Parameters:
 *   - id (required): ID of the topic to delete
 * 
 * @param {NextRequest} request - HTTP request with query parameters
 * @returns {NextResponse} Success message, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const topicId = Number(id);

    if (!Number.isInteger(topicId) || topicId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.topics.delete({
      where: { id: topicId },
    });

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("[Error] DELETE /api/admin/topics:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}

