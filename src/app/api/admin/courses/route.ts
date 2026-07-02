/**
 * COURSES API ROUTE
 * 
 * Handles CRUD operations for language courses (e.g., English, Spanish).
 * Courses are the top-level organizational unit containing topics and lessons.
 * 
 * Endpoints:
 * - POST /api/admin/courses - Create a new course
 * - GET /api/admin/courses - List all courses
 * - PUT /api/admin/courses - Update an existing course
 * - DELETE /api/admin/courses?slug=... - Delete a course by slug
 * 
 * @module api/admin/courses
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler - Create a new course
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - slug (string, required): URL-friendly identifier for the course
 *   - title (string, required): Display name of the course
 *   - description (string, optional): Detailed course description
 * 
 * @returns {NextResponse} Created course object with 201 status, or error with 400/500 status
 */
export async function POST(request: NextRequest) {
  try {
    const { slug, title, description } = await request.json();

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug and title are required" },
        { status: 400 }
      );
    }

    // Create course in database
    const course = await prisma.courses.create({
      data: {
        slug,
        title,
        description,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/courses:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Retrieve all courses
 * 
 * @returns {NextResponse} Array of all courses ordered by slug, or error with 500 status
 */
export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      orderBy: { slug: "asc" },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("[Error] GET /api/admin/courses:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update an existing course
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - slug (string, required): Current course slug (used as lookup key)
 *   - title (string, required): Updated course title
 *   - description (string, optional): Updated description
 *   - newSlug (string, optional): New slug if renaming the course
 * 
 * @returns {NextResponse} Updated course object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const { slug, title, description, newSlug } = await request.json();

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug and title are required" },
        { status: 400 }
      );
    }

    // Update course with optional slug rename
    const course = await prisma.courses.update({
      where: { slug },
      data: {
        slug: newSlug || slug,
        title,
        description,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[Error] PUT /api/admin/courses:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a course and all associated topics/lessons
 * 
 * Query Parameters:
 *   - slug (string, required): Course slug to delete
 * 
 * Note: Cascading delete removes all related topics, lessons, and content.
 * 
 * @returns {NextResponse} Success message with 200 status, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Validate required parameter
    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    // Delete course (cascades to related data)
    await prisma.courses.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("[Error] DELETE /api/admin/courses:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
