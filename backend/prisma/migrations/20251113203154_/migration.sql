-- AlterTable
ALTER TABLE "Store" RENAME CONSTRAINT "Industry_pkey" TO "Store_pkey";

-- RenameForeignKey
ALTER TABLE "PriceResearch" RENAME CONSTRAINT "PriceResearch_industryId_fkey" TO "PriceResearch_storeId_fkey";

-- RenameForeignKey
ALTER TABLE "Visit" RENAME CONSTRAINT "Visit_industryId_fkey" TO "Visit_storeId_fkey";
