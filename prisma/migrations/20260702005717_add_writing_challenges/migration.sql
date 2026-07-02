-- AlterEnum
ALTER TYPE "lesson_type" ADD VALUE 'writing-challenges';

-- CreateTable
CREATE TABLE "writing_challenge_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "prompt" TEXT NOT NULL,
    "min_words" INTEGER NOT NULL DEFAULT 50,
    "max_words" INTEGER NOT NULL DEFAULT 300,
    "required_vocabulary" TEXT,
    "example_answer" TEXT,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',
    "challenge_order" INTEGER NOT NULL DEFAULT 0,
    "evaluation_criteria" TEXT,
    "hint" TEXT,

    CONSTRAINT "writing_challenge_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "writing_challenge_contents" ADD CONSTRAINT "fk_lesson_writing_challenge" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
