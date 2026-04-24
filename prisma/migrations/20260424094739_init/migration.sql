/*
  Warnings:

  - You are about to drop the column `linkImage` on the `Item` table. All the data in the column will be lost.
  - Added the required column `linkImage` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "linkImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "linkImage";
