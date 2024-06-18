/*
  Warnings:

  - A unique constraint covering the columns `[segment]` on the table `segments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "segments_segment_key" ON "segments"("segment");
