/*
  Warnings:

  - You are about to drop the column `external_button_text` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `external_url` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_approved` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_cod` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_external` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_free_shipping` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_random_related_products` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_return` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_sale_enable` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_trending` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `product_meta_image_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `product_thumbnail_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sale_expired_at` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sale_price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sale_starts_at` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `self_life` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_days` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `size_chart_image_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_status` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `discount` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `emailVerifiedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `relatedproduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviewrating` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `relatedproduct` DROP FOREIGN KEY `RelatedProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `relatedproduct` DROP FOREIGN KEY `RelatedProduct_relatedProductId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewrating` DROP FOREIGN KEY `ReviewRating_productId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `external_button_text`,
    DROP COLUMN `external_url`,
    DROP COLUMN `is_approved`,
    DROP COLUMN `is_cod`,
    DROP COLUMN `is_external`,
    DROP COLUMN `is_featured`,
    DROP COLUMN `is_free_shipping`,
    DROP COLUMN `is_random_related_products`,
    DROP COLUMN `is_return`,
    DROP COLUMN `is_sale_enable`,
    DROP COLUMN `is_trending`,
    DROP COLUMN `meta_description`,
    DROP COLUMN `meta_title`,
    DROP COLUMN `product_meta_image_id`,
    DROP COLUMN `product_thumbnail_id`,
    DROP COLUMN `sale_expired_at`,
    DROP COLUMN `sale_price`,
    DROP COLUMN `sale_starts_at`,
    DROP COLUMN `self_life`,
    DROP COLUMN `shipping_days`,
    DROP COLUMN `short_description`,
    DROP COLUMN `size_chart_image_id`,
    DROP COLUMN `stock_status`,
    ADD COLUMN `approved` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `buyPrice` DOUBLE NULL DEFAULT 0.0,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `expDt` DATETIME(3) NULL,
    ADD COLUMN `imagePath` VARCHAR(191) NULL,
    ADD COLUMN `isAvailable` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFreeShipping` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isReturn` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `license` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `maxDt` DATETIME(3) NULL,
    ADD COLUMN `rating` VARCHAR(191) NULL,
    ADD COLUMN `salePrice` DOUBLE NOT NULL,
    ADD COLUMN `sizeChart` VARCHAR(191) NULL,
    ADD COLUMN `stockCount` INTEGER NULL,
    ADD COLUMN `tag` VARCHAR(191) NULL,
    ADD COLUMN `thumbnailPath` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    ADD COLUMN `url` VARCHAR(191) NULL,
    MODIFY `weight` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `discount` DOUBLE NULL DEFAULT 0.0,
    MODIFY `sku` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailVerifiedAt`,
    ADD COLUMN `favorite` VARCHAR(191) NULL,
    ADD COLUMN `lastLoginDt` DATETIME(3) NULL,
    ADD COLUMN `wishlist` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `relatedproduct`;

-- DropTable
DROP TABLE `reviewrating`;

-- CreateTable
CREATE TABLE `Brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ImagePath` VARCHAR(191) NULL,
    `BannerPath` VARCHAR(191) NULL,
    `Description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ImagePath` VARCHAR(191) NULL,
    `BannerPath` VARCHAR(191) NULL,
    `Description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ImagePath` VARCHAR(191) NULL,
    `BannerPath` VARCHAR(191) NULL,
    `Description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
