/**
 * SERVER ACTIONS - MODULE DATA FETCHING
 *
 * Centralized server-side data fetching functions for course, topic, and lesson data.
 * These functions execute on the server and provide optimized queries to the client.
 * 
 * All functions:
 * - Use Prisma ORM with PostgreSQL
 * - Include proper error handling and logging
 * - Support nested data fetching with include clauses
 * - Return strongly-typed data
 *
 * @module modules
 */

"use server";

import { prisma } from "@/lib/prisma";

/**
 * Generic error handler for data fetching operations.
 * Logs error details and safely re-throws for client-side handling.
 *
 * @param {string} operationName - Name of the failed operation for logging
 * @param {Error} error - The error object
 * @throws {Error} Re-throws the original error after logging
 */
const handleFetchError = (operationName: string, error: Error): never => {
  console.error(`[Error] ${operationName}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
  throw error;
};

/**
 * Fetches all courses with their associated topics and lessons.
 * Ordered by course ID for consistent presentation.
 *
 * @async
 * @returns {Promise<Object[]>} Array of courses with nested topics and lessons
 * @throws {Error} Database connection or query error
 *
 * @example
 * const courses = await fetchCourses();
 * console.log(courses[0].topics[0].lessons);
 */
export async function fetchCourses() {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        topics: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return courses;
  } catch (error) {
    handleFetchError("fetchCourses", error as Error);
  }
}

/**
 * Fetches a single course by its URL slug.
 * Used for course detail pages and course-specific navigation.
 *
 * @async
 * @param {string} courseSlug - URL-friendly course identifier
 * @returns {Promise<Object|null>} Course object or null if not found
 * @throws {Error} Database query error
 *
 * @example
 * const course = await fetchCourseBySlug("english");
 */
export async function fetchCourseBySlug(courseSlug: string) {
  try {
    return prisma.courses.findUnique({
      where: {
        slug: courseSlug,
      },
    });
  } catch (error) {
    handleFetchError("fetchCourseBySlug", error as Error);
  }
}

/**
 * Fetches all topics and lessons for a specific course.
 * Returns complete lesson data with all content types (video, reading, etc.).
 * This is the primary data source for course dashboards.
 *
 * @async
 * @param {string} courseSlug - URL-friendly course identifier
 * @returns {Promise<{topics: Object[]}>} Topics with nested lessons and content
 * @throws {Error} Database query error
 *
 * @example
 * const { topics } = await fetchModulesForCourse("english");
 * topics.forEach(topic => {
 *   topic.lessons.forEach(lesson => {
 *     console.log(lesson.type); // "video", "flashcards", etc.
 *   });
 * });
 */
export async function fetchModulesForCourse(courseSlug: string) {
  try {
    const topics = await prisma.topics.findMany({
      where: {
        course_slug: courseSlug,
      },
      include: {
        lessons: {
          include: {
            topics: true,
            video_contents: true,
            drag_drop_contents: true,
            flashcard_contents: true,
            reading_contents: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return { topics };
  } catch (error) {
    handleFetchError("fetchModulesForCourse", error as Error);
  }
}

/**
 * Fetches a lesson with its video content.
 * Optimized for video lessons to prevent unnecessary data loading.
 *
 * @async
 * @param {number} lessonId - Database ID of the lesson
 * @returns {Promise<Object|null>} Lesson with video_contents array
 * @throws {Error} Database query error
 */
export async function fetchLessonWithVideoContent(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        video_contents: true,
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithVideoContent", error as Error);
  }
}

/**
 * Fetches a lesson with its drag-drop exercise content.
 * Used for interactive drag-and-drop grammar exercises.
 *
 * @async
 * @param {number} lessonId - Database ID of the lesson
 * @returns {Promise<Object|null>} Lesson with drag_drop_contents array
 * @throws {Error} Database query error
 */
export async function fetchLessonWithDragDropContent(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        drag_drop_contents: true,
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithDragDropContent", error as Error);
  }
}

/**
 * Fetches a lesson with its flashcard content.
 * Used for spaced repetition vocabulary practice.
 *
 * @async
 * @param {number} lessonId - Database ID of the lesson
 * @returns {Promise<Object|null>} Lesson with flashcard_contents array
 * @throws {Error} Database query error
 */
export async function fetchLessonWithFlashcardContent(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        flashcard_contents: true,
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithFlashcardContent", error as Error);
  }
}

/**
 * Fetches a lesson with its reading content and glossary items.
 * Used for reading comprehension exercises with interactive vocabulary.
 *
 * @async
 * @param {number} lessonId - Database ID of the lesson
 * @returns {Promise<Object|null>} Lesson with reading_contents and glossary_items
 * @throws {Error} Database query error
 */
export async function fetchLessonWithReadingContent(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        reading_contents: {
          include: {
            glossary_items: true,
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithReadingContent", error as Error);
  }
}

/**
 * Fetches a lesson with its visio-acoustic quiz content.
 * Used for diagnostic audio-visual association exercises.
 *
 * @async
 * @param {number} lessonId - Database ID of the lesson
 * @returns {Promise<Object|null>} Lesson with visio_acoustic_contents array sorted by question order
 * @throws {Error} Database query error
 *
 * @example
 * const lesson = await fetchLessonWithVisioAcousticContent(5);
 * console.log(lesson.visio_acoustic_contents); // Array of quiz questions
 */
export async function fetchLessonWithVisioAcousticContent(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        visio_acoustic_contents: {
          orderBy: { question_order: "asc" },
        },
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithVisioAcousticContent", error as Error);
  }
}

/**
 * Fetches a lesson with its associated writing challenge content.
 * Retrieves all writing exercises sorted by challenge order.
 *
 * @async
 * @param {number} lessonId - The lesson ID to fetch
 * @returns {Promise<Object|null>} Lesson object with writing_challenge_contents array
 * @throws {Error} Database query error
 *
 * @example
 * const lesson = await fetchLessonWithWritingChallenges(6);
 * console.log(lesson.writing_challenge_contents); // Array of writing challenges
 */
export async function fetchLessonWithWritingChallenges(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        writing_challenge_contents: {
          orderBy: { challenge_order: "asc" },
        },
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithWritingChallenges", error as Error);
  }
}

/**
 * Fetches a lesson with its associated mental agility content (timed challenges).
 * Retrieves all mental agility challenges sorted by challenge order.
 *
 * @async
 * @param {number} lessonId - The lesson ID to fetch
 * @returns {Promise<Object|null>} Lesson object with mental_agility_contents array
 * @throws {Error} Database query error
 *
 * @example
 * const lesson = await fetchLessonWithMentalAgility(7);
 * console.log(lesson.mental_agility_contents); // Array of challenges
 */
export async function fetchLessonWithMentalAgility(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        mental_agility_contents: {
          orderBy: { challenge_order: "asc" },
        },
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithMentalAgility", error as Error);
  }
}

/**
 * Fetches a lesson with its associated closing exam content.
 * Retrieves all closing exam questions sorted by question order.
 *
 * @async
 * @param {number} lessonId - The lesson ID to fetch
 * @returns {Promise<Object|null>} Lesson object with closing_exam_contents array
 * @throws {Error} Database query error
 *
 * @example
 * const lesson = await fetchLessonWithClosingExam(8);
 * console.log(lesson.closing_exam_contents); // Array of exam questions
 */
export async function fetchLessonWithClosingExam(lessonId: number) {
  try {
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: {
        closing_exam_contents: {
          orderBy: { question_order: "asc" },
        },
      },
    });

    return lesson;
  } catch (error) {
    handleFetchError("fetchLessonWithClosingExam", error as Error);
  }
}
