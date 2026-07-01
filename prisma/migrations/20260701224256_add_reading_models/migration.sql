-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "glossary_items" ADD CONSTRAINT "fk_reading_glossary" FOREIGN KEY ("reading_id") REFERENCES "reading_contents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
