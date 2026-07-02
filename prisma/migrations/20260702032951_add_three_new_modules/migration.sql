-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "lesson_type" ADD VALUE 'grammar-guides';
ALTER TYPE "lesson_type" ADD VALUE 'listening';
ALTER TYPE "lesson_type" ADD VALUE 'icebreaker';

-- CreateTable
CREATE TABLE "grammar_guides_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "structure_schema" TEXT NOT NULL,
    "example_sentences" TEXT NOT NULL,
    "image_url" VARCHAR(255),
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "guide_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "grammar_guides_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "question" TEXT NOT NULL,
    "audio_url" VARCHAR(255) NOT NULL,
    "image_options" TEXT NOT NULL,
    "correct_answer" INTEGER NOT NULL,
    "feedback_correct" TEXT,
    "feedback_incorrect" TEXT,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "question_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "listening_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icebreaker_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "expression" TEXT NOT NULL,
    "illustration_url" VARCHAR(255) NOT NULL,
    "situation_description" TEXT NOT NULL,
    "pair_id" INTEGER,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "pair_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "icebreaker_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grammar_guides_contents" ADD CONSTRAINT "fk_lesson_grammar_guides" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listening_contents" ADD CONSTRAINT "fk_lesson_listening" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "icebreaker_contents" ADD CONSTRAINT "fk_lesson_icebreaker" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
