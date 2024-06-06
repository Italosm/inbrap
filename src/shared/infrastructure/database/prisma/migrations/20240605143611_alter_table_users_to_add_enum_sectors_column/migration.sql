-- CreateEnum
CREATE TYPE "UserSectors" AS ENUM ('IT', 'MARKETING', 'MANAGER', 'ASSISTANT', 'SALES', 'BILLING', 'DIRECTOR', 'FINANCE', 'HR', 'SAC', 'GUEST');

-- AlterEnum
ALTER TYPE "UserRoles" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "sectors" "UserSectors"[] DEFAULT ARRAY['GUEST']::"UserSectors"[];
