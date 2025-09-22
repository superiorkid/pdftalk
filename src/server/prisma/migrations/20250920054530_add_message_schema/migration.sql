-- CreateEnum
CREATE TYPE "public"."MessageSender" AS ENUM ('USER', 'AI');

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "sender" "public"."MessageSender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
