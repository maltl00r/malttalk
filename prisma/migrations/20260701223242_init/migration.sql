-- CreateEnum
CREATE TYPE "lesson_type" AS ENUM ('video', 'flashcards', 'drag-drop', 'reading');

-- CreateTable
CREATE TABLE "courses" (
    "slug" VARCHAR(255) NOT NULL,
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "drag_drop_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "feedback_message_wrong" TEXT,

    CONSTRAINT "drag_drop_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "front_image" VARCHAR(255),
    "back_title" VARCHAR(255) NOT NULL,
    "back_pronunciation" VARCHAR(255),
    "lang" VARCHAR(10) NOT NULL,

    CONSTRAINT "flashcard_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_tag" (
    "lesson_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "lesson_tag_pkey" PRIMARY KEY ("lesson_id","tag_id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "uuid" UUID DEFAULT gen_random_uuid(),
    "topic_id" INTEGER NOT NULL,
    "type" "lesson_type" NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "course_slug" VARCHAR(255) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "video_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_contents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "reading_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_items" (
    "id" SERIAL NOT NULL,
    "reading_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "definition" TEXT NOT NULL,
    "image_url" VARCHAR(255),
    "synonym_english" VARCHAR(255),

    CONSTRAINT "glossary_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lessons_uuid_key" ON "lessons"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- AddForeignKey
ALTER TABLE "drag_drop_contents" ADD CONSTRAINT "fk_lesson_drag_drop" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flashcard_contents" ADD CONSTRAINT "fk_lesson_flashcard" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lesson_tag" ADD CONSTRAINT "fk_lesson_tag_lesson" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lesson_tag" ADD CONSTRAINT "fk_lesson_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "fk_topic" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "fk_course" FOREIGN KEY ("course_slug") REFERENCES "courses"("slug") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "video_contents" ADD CONSTRAINT "fk_lesson_video" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reading_contents" ADD CONSTRAINT "fk_lesson_reading" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
