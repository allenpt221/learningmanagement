-- CreateTable
CREATE TABLE "public"."Community" (
    "id" TEXT NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "department" "public"."DepartmentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Community" ADD CONSTRAINT "Community_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
