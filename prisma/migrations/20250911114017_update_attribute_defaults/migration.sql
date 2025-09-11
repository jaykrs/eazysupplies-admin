/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attribute_slug_key` ON `Attribute`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `AttributeValue_slug_key` ON `AttributeValue`(`slug`);
