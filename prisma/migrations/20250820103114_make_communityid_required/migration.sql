/*
  Warnings:

  - Made the column `communityId` on table `CommunityPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CommunityPost" ALTER COLUMN "communityId" SET NOT NULL;
