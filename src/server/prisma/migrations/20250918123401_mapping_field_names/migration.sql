/*
  Warnings:

  - You are about to drop the column `accessToken` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpiresAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiresAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `verification` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_userId_fkey";

-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpiresAt",
DROP COLUMN "accountId",
DROP COLUMN "createdAt",
DROP COLUMN "idToken",
DROP COLUMN "providerId",
DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiresAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "access_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_token" TEXT,
ADD COLUMN     "provider_id" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "refresh_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."documents" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."session" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "ipAddress",
DROP COLUMN "updatedAt",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."verification" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
