/**
 * GLOSSARY ITEMS API ROUTE
 * 
 * Handles CRUD operations for vocabulary definitions and glossary terms.
 * Glossary items provide click-to-define functionality in reading lessons
 * with support for images, definitions, and English translations.
 * 
 * Endpoints:
 * - POST /api/admin/glossary-items - Create glossary item
 * - GET /api/admin/glossary-items - List all glossary items
 * - PUT /api/admin/glossary-items - Update glossary item
 * - DELETE /api/admin/glossary-items?id=... - Delete glossary item
 * 
 * @module api/admin/glossary-items
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler - Retrieve all glossary items
 * 
 * @returns {NextResponse} Array of all glossary items with related reading content and lessons, or error with 500 status
 */
export async function GET() {
  try {
    const glossaryItems = await prisma.glossary_items.findMany({
      include: {
        reading_contents: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { word: "asc" },
    });

    return NextResponse.json(glossaryItems);
  } catch (error) {
    console.error("[Error] GET /api/admin/glossary-items:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch glossary items" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a glossary item
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - reading_id (number, required): ID of the parent reading content
 *   - word (string, required): Target vocabulary word/phrase
 *   - definition (string, required): Definition in the learning language
 *   - image_url (string, optional): URL to visual reference image
 *   - synonym_english (string, optional): English translation or synonym
 * 
 * @returns {NextResponse} Created glossary item with 201 status, or error with 400/404/500 status
 *   - 404: Reading content not found
 */
export async function POST(request: NextRequest) {
  try {
    const { reading_id, word, definition, image_url, synonym_english } = await request.json();
    const readingId = Number(reading_id);

    if (!Number.isInteger(readingId) || readingId <= 0 || !word || !definition) {
      return NextResponse.json(
        { error: "reading_id must be a valid integer, word and definition are required" },
        { status: 400 }
      );
    }

    const readingContent = await prisma.reading_contents.findUnique({ 
      where: { id: readingId } 
    });

    if (!readingContent) {
      return NextResponse.json({ error: "Reading content not found" }, { status: 404 });
    }

    const glossaryItem = await prisma.glossary_items.create({
      data: {
        reading_id: readingId,
        word,
        definition,
        image_url,
        synonym_english,
      },
    });

    return NextResponse.json(glossaryItem, { status: 201 });
  } catch (error) {
    console.error("[Error] POST /api/admin/glossary-items:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to create glossary item" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update a glossary item
 * 
 * @param {NextRequest} request - HTTP request with JSON body containing:
 *   - id (number, required): ID of the glossary item to update
 *   - word (string, optional): Updated vocabulary word
 *   - definition (string, optional): Updated definition
 *   - image_url (string, optional): Updated image URL
 *   - synonym_english (string, optional): Updated English translation
 * 
 * @returns {NextResponse} Updated glossary item with related content data, or error with 400/500 status
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, word, definition, image_url, synonym_english } = await request.json();
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    const glossaryItem = await prisma.glossary_items.update({
      where: { id: itemId },
      data: {
        word: word !== undefined ? word : undefined,
        definition: definition !== undefined ? definition : undefined,
        image_url: image_url !== undefined ? image_url : undefined,
        synonym_english: synonym_english !== undefined ? synonym_english : undefined,
      },
      include: {
        reading_contents: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return NextResponse.json(glossaryItem);
  } catch (error) {
    console.error("[Error] PUT /api/admin/glossary-items:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to update glossary item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a glossary item by ID
 * 
 * Query Parameters:
 *   - id (required): ID of the glossary item to delete
 * 
 * @param {NextRequest} request - HTTP request with query parameters
 * @returns {NextResponse} Success message, or error with 400/500 status
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "id must be a valid integer" },
        { status: 400 }
      );
    }

    await prisma.glossary_items.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Glossary item deleted" });
  } catch (error) {
    console.error("[Error] DELETE /api/admin/glossary-items:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete glossary item" },
      { status: 500 }
    );
  }
}
