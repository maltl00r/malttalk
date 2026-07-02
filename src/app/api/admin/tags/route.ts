/**
 * TAGS API ROUTE
 * 
 * Handles CRUD operations for lesson categorization tags.
 * Tags enable flexible lesson organization and discovery through keywords.
 * 
 * Endpoints:
 * - POST /api/admin/tags - Create a new tag
 * - GET /api/admin/tags - List all tags
 * - PUT /api/admin/tags - Update an existing tag
 * - DELETE /api/admin/tags?id=... - Delete a tag by ID
 * 
 * @module api/admin/tags
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler - Retrieve all tags
 * 
 * @returns {NextResponse} Array of all tags sorted alphabetically by name, or error with 500 status
 */
export async function GET() {
  try {
    const tags = await prisma.tags.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("[Error] GET /api/admin/tags:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}

/**
 * POST handler - Create a new tag
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - slug (string, required): URL-friendly identifier (must be unique)
 *   - name (string, required): Display name of the tag
 * 
 * @returns {NextResponse} Created tag object with 201 status, or error with 400/409/500 status
 *   - 409: Tag with this slug already exists (unique constraint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "slug and name are required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existing = await prisma.tags.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 409 }
      );
    }

    const tag = await prisma.tags.create({
      data: { slug, name },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/tags:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Error creating tag" }, { status: 500 });
  }
}

/**
 * PUT handler - Update an existing tag
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - id (number, required): ID of the tag to update
 *   - slug (string, required): Updated URL-friendly identifier
 *   - name (string, required): Updated display name
 * 
 * @returns {NextResponse} Updated tag object, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, slug, name } = await request.json();
    const tagId = Number(id);

    if (!Number.isInteger(tagId) || tagId <= 0 || !slug || !name) {
      return NextResponse.json(
        { error: "id, slug and name are required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tags.update({
      where: { id: tagId },
      data: { slug, name },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[Error] PUT /api/admin/tags:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Error updating tag" }, { status: 500 });
  }
}

/**
 * DELETE handler - Remove a tag by ID
 * 
 * Query Parameters:
 *   - id (required): ID of the tag to delete
 * 
 * @param {NextRequest} request - HTTP request with query parameters
 * @returns {NextResponse} Success message, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("id");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Delete the tag (cascade should handle relations)
    await prisma.tags.delete({
      where: { id: parseInt(tagId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Error] DELETE /api/admin/tags:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Error deleting tag" }, { status: 500 });
  }
}
