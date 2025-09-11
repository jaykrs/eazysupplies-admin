/*
  Warnings:

  - You are about to drop the column `BannerPath` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `ImagePath` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `BannerPath` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `ImagePath` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `HsnHac` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `buyPrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `expDt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isFreeShipping` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isReturn` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `maxDt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `packing` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sizeChart` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stockCount` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailPath` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `brand` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to drop the column `BannerPath` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `ImagePath` on the `tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_at` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `brand` DROP COLUMN `BannerPath`,
    DROP COLUMN `Description`,
    DROP COLUMN `ImagePath`,
    ADD COLUMN `brandBanner` VARCHAR(191) NULL,
    ADD COLUMN `brandImage` VARCHAR(191) NULL,
    ADD COLUMN `brandMetaImage` VARCHAR(191) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `created_by_id` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `BannerPath`,
    DROP COLUMN `Description`,
    DROP COLUMN `ImagePath`,
    ADD COLUMN `blogId` INTEGER NULL,
    ADD COLUMN `blogs_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `categoryIconId` INTEGER NULL,
    ADD COLUMN `categoryImageId` INTEGER NULL,
    ADD COLUMN `categoryMetaImageId` INTEGER NULL,
    ADD COLUMN `commission_rate` DOUBLE NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `created_by_id` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL,
    ADD COLUMN `parent_id` INTEGER NULL,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `products_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `HsnHac`,
    DROP COLUMN `approved`,
    DROP COLUMN `buyPrice`,
    DROP COLUMN `category`,
    DROP COLUMN `expDt`,
    DROP COLUMN `imagePath`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `isFeatured`,
    DROP COLUMN `isFreeShipping`,
    DROP COLUMN `isReturn`,
    DROP COLUMN `license`,
    DROP COLUMN `maxDt`,
    DROP COLUMN `packing`,
    DROP COLUMN `quality`,
    DROP COLUMN `rating`,
    DROP COLUMN `salePrice`,
    DROP COLUMN `sizeChart`,
    DROP COLUMN `stockCount`,
    DROP COLUMN `tag`,
    DROP COLUMN `thumbnailPath`,
    DROP COLUMN `title`,
    DROP COLUMN `url`,
    ADD COLUMN `brand_id` INTEGER NULL,
    ADD COLUMN `can_review` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by_id` VARCHAR(191) NULL,
    ADD COLUMN `cross_products` JSON NULL,
    ADD COLUMN `cross_sell_products` JSON NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `encourage_order` INTEGER NULL,
    ADD COLUMN `encourage_view` INTEGER NULL,
    ADD COLUMN `estimated_delivery_text` VARCHAR(191) NULL,
    ADD COLUMN `external_button_text` VARCHAR(191) NULL,
    ADD COLUMN `external_url` VARCHAR(191) NULL,
    ADD COLUMN `is_approved` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_cod` INTEGER NULL,
    ADD COLUMN `is_external` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_featured` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_free_shipping` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_licensable` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `is_licensekey_auto` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `is_random_related_products` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_return` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_sale_enable` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_trending` INTEGER NULL DEFAULT 0,
    ADD COLUMN `is_wishlist` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `license_type` VARCHAR(191) NULL,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL,
    ADD COLUMN `order_amount` DOUBLE NULL DEFAULT 0.0,
    ADD COLUMN `orders_count` INTEGER NULL,
    ADD COLUMN `preview_audio_file_id` INTEGER NULL,
    ADD COLUMN `preview_type` VARCHAR(191) NULL,
    ADD COLUMN `preview_url` VARCHAR(191) NULL,
    ADD COLUMN `preview_video_file_id` INTEGER NULL,
    ADD COLUMN `product_galleries` JSON NULL,
    ADD COLUMN `product_meta_image_id` INTEGER NULL,
    ADD COLUMN `product_thumbnail_id` INTEGER NULL,
    ADD COLUMN `product_type` VARCHAR(191) NULL,
    ADD COLUMN `quantity` VARCHAR(191) NULL,
    ADD COLUMN `rating_count` INTEGER NULL,
    ADD COLUMN `related_products` JSON NULL,
    ADD COLUMN `return_policy_text` VARCHAR(191) NULL,
    ADD COLUMN `review_ratings` JSON NULL,
    ADD COLUMN `reviews` JSON NULL,
    ADD COLUMN `reviews_count` INTEGER NULL,
    ADD COLUMN `safe_checkout` INTEGER NULL DEFAULT 0,
    ADD COLUMN `sale_expired_at` DATETIME(3) NULL,
    ADD COLUMN `sale_price` DOUBLE NULL DEFAULT 0.0,
    ADD COLUMN `sale_starts_at` DATETIME(3) NULL,
    ADD COLUMN `secure_checkout` INTEGER NULL DEFAULT 0,
    ADD COLUMN `separator` VARCHAR(191) NULL,
    ADD COLUMN `shipping_days` INTEGER NULL DEFAULT 0,
    ADD COLUMN `short_description` VARCHAR(191) NULL,
    ADD COLUMN `similar_products` JSON NULL,
    ADD COLUMN `size_chart_image_id` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NULL,
    ADD COLUMN `social_share` INTEGER NULL DEFAULT 0,
    ADD COLUMN `status` INTEGER NULL DEFAULT 0,
    ADD COLUMN `stock_status` VARCHAR(191) NULL,
    ADD COLUMN `storeId` INTEGER NULL,
    ADD COLUMN `store_id` INTEGER NULL,
    ADD COLUMN `tax_id` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `variations` JSON NULL,
    ADD COLUMN `watermark` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `watermark_image_id` VARCHAR(191) NULL,
    ADD COLUMN `watermark_position` VARCHAR(191) NULL,
    ADD COLUMN `wholesale_price_type` VARCHAR(191) NULL,
    ADD COLUMN `wholesales` JSON NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NULL,
    MODIFY `unit` VARCHAR(191) NULL,
    MODIFY `weight` VARCHAR(191) NULL,
    MODIFY `price` DOUBLE NULL DEFAULT 0.0,
    MODIFY `brand` JSON NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tag` DROP COLUMN `BannerPath`,
    DROP COLUMN `Description`,
    DROP COLUMN `ImagePath`,
    ADD COLUMN `blogs_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `created_by_id` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `products_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Attribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `style` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `productId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `hex_color` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `attribute_id` INTEGER NOT NULL,
    `created_by_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `store_logo_id` INTEGER NULL,
    `store_cover_id` INTEGER NULL,
    `country_id` INTEGER NOT NULL,
    `state_id` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `facebook` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `pinterest` VARCHAR(191) NULL,
    `hide_vendor_email` BOOLEAN NOT NULL DEFAULT false,
    `hide_vendor_phone` BOOLEAN NOT NULL DEFAULT false,
    `vendor_id` INTEGER NOT NULL,
    `created_by_id` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `orders_count` INTEGER NULL DEFAULT 0,
    `reviews_count` INTEGER NULL DEFAULT 0,
    `products_count` INTEGER NULL DEFAULT 0,
    `order_amount` DOUBLE NULL DEFAULT 0.0,
    `rating_count` INTEGER NULL DEFAULT 0,
    `country` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `reviews` JSON NULL,
    `product_images` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `country_code` VARCHAR(191) NOT NULL,
    `phone` BIGINT NOT NULL,
    `profile_image_id` INTEGER NULL,
    `system_reserve` VARCHAR(191) NULL DEFAULT '0',
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by_id` INTEGER NULL,
    `email_verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orders_count` INTEGER NULL DEFAULT 0,
    `role_id` INTEGER NULL,
    `profile_image` JSON NULL,
    `wallet` JSON NULL,
    `point` JSON NULL,

    UNIQUE INDEX `Vendor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `meta_title` VARCHAR(191) NULL,
    `meta_description` VARCHAR(191) NULL,
    `blog_thumbnail_id` INTEGER NULL,
    `blog_meta_image_id` INTEGER NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `is_sticky` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `blog_thumbnail` JSON NULL,
    `blog_meta_image` JSON NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `blogs_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlogToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BlogToTag_AB_unique`(`A`, `B`),
    INDEX `_BlogToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Brand_slug_key` ON `Brand`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Tag_slug_key` ON `Tag`(`slug`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attribute` ADD CONSTRAINT `Attribute_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD CONSTRAINT `AttributeValue_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `Attribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendor` ADD CONSTRAINT `Vendor_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogToTag` ADD CONSTRAINT `_BlogToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogToTag` ADD CONSTRAINT `_BlogToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
