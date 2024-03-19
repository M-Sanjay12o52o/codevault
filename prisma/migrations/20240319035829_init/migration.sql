-- CreateTable
CREATE TABLE "CodeSnippet" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "codeLanguage" TEXT NOT NULL,
    "stdin" TEXT,
    "sourceCode" TEXT NOT NULL,

    CONSTRAINT "CodeSnippet_pkey" PRIMARY KEY ("id")
);
