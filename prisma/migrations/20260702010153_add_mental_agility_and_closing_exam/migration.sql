-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "lesson_type" ADD VALUE 'mental-agility';
ALTER TYPE "lesson_type" ADD VALUE 'closing-exam';

-- CreateTable
CREATE TABLE "mental_agility_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "prompt" TEXT NOT NULL,
    "time_limit" INTEGER NOT NULL DEFAULT 30,
    "correct_answer" VARCHAR(255) NOT NULL,
    "option_b" VARCHAR(255) NOT NULL,
    "option_c" VARCHAR(255) NOT NULL,
    "option_d" VARCHAR(255),
    "image_url" VARCHAR(255),
    "feedback_correct" TEXT,
    "feedback_incorrect" TEXT,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "challenge_order" INTEGER NOT NULL DEFAULT 0,
    "challenge_type" VARCHAR(100),

    CONSTRAINT "mental_agility_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closing_exam_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "time_limit" INTEGER NOT NULL DEFAULT 600,
    "question" TEXT NOT NULL,
    "correct_answer" VARCHAR(255) NOT NULL,
    "option_b" VARCHAR(255) NOT NULL,
    "option_c" VARCHAR(255) NOT NULL,
    "option_d" VARCHAR(255),
    "passing_score" INTEGER NOT NULL DEFAULT 70,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "question_order" INTEGER NOT NULL DEFAULT 0,
    "points_value" INTEGER NOT NULL DEFAULT 1,
    "feedback_correct" TEXT,
    "feedback_incorrect" TEXT,

    CONSTRAINT "closing_exam_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mental_agility_contents" ADD CONSTRAINT "fk_lesson_mental_agility" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "closing_exam_contents" ADD CONSTRAINT "fk_lesson_closing_exam" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
