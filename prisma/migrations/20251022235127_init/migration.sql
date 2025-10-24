-- CreateEnum
CREATE TYPE "LineStatus" AS ENUM ('online', 'offline');

-- CreateTable
CREATE TABLE "CourtSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" BIGINT,
    "minutesPlanned" INTEGER NOT NULL,
    "running" BOOLEAN NOT NULL,
    "tasks" JSONB NOT NULL,
    "messages" JSONB NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "CourtSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineStatus" "LineStatus" NOT NULL DEFAULT 'online',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
