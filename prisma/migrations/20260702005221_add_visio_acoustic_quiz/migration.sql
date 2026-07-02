-- AlterEnum
ALTER TYPE "lesson_type" ADD VALUE 'visio-acoustic';

-- AlterTable
ALTER TABLE "video_contents" ADD COLUMN     "duration" INTEGER DEFAULT 600;

-- CreateTable
CREATE TABLE "visio_acoustic_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "question_text" VARCHAR(255) NOT NULL,
    "sound_url" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "correct_answer" VARCHAR(255) NOT NULL,
    "option_b" VARCHAR(255) NOT NULL,
    "option_c" VARCHAR(255) NOT NULL,
    "option_d" VARCHAR(255),
    "feedback_correct" TEXT,
    "feedback_incorrect" TEXT,
    "question_order" INTEGER NOT NULL DEFAULT 0,
    "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'beginner',

    CONSTRAINT "visio_acoustic_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visio_acoustic_contents" ADD CONSTRAINT "fk_lesson_visio_acoustic" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
