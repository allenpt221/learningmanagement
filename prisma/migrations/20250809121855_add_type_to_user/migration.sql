/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DepartmentType" AS ENUM ('College of Computing Studies', 'College of Engineering And Arts', 'College of Business Studies');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "type" "public"."DepartmentType" NOT NULL;
