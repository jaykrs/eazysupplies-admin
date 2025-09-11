/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tag` DROP COLUMN `created_by_id`,
    ADD COLUMN `createdById` INTEGER NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 0;
