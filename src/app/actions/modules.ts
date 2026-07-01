"use server";

import { prisma } from "@/lib/prisma";

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
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export async function fetchCourseBySlug(courseSlug: string) {
  try {
    return prisma.courses.findUnique({
      where: {
        slug: courseSlug,
      },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

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
    console.error("Error fetching modules for course:", error);
    throw error;
  }
}

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
    console.error("Error fetching video content:", error);
    throw error;
  }
}

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
    console.error("Error fetching drag-drop content:", error);
    throw error;
  }
}

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
    console.error("Error fetching flashcard content:", error);
    throw error;
  }
}

