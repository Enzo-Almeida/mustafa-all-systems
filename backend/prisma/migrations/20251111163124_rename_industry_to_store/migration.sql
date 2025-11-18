-- Rename Industry to Store
ALTER TABLE "Industry" RENAME TO "Store";
ALTER TABLE "Visit" RENAME COLUMN "industryId" TO "storeId";
ALTER TABLE "PriceResearch" RENAME COLUMN "industryId" TO "storeId";
ALTER INDEX "Visit_industryId_idx" RENAME TO "Visit_storeId_idx";
ALTER INDEX "PriceResearch_industryId_idx" RENAME TO "PriceResearch_storeId_idx";

