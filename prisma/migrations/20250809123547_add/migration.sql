/*
  Warnings:

  - Added the required column `department` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "department" "public"."DepartmentType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "type" SET DEFAULT 'College of Computing Studies';
