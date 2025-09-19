-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "author_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
