/*
  Warnings:

  - The primary key for the `CodeSnippet` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CodeSnippet" DROP CONSTRAINT "CodeSnippet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CodeSnippet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CodeSnippet_id_seq";
