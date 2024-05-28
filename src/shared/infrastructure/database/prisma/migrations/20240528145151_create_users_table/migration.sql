-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('USER', 'ADMIN', 'OWNER', 'ASSISTANT', 'SELLER', 'SUPERVISOR', 'DIRECTOR', 'FINANCIAL', 'HR', 'SAC');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(100) NOT NULL,
    "avatar" VARCHAR(255),
    "roles" "UserRoles"[] DEFAULT ARRAY['USER']::"UserRoles"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
