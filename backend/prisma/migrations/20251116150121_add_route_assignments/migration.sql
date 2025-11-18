-- CreateTable
CREATE TABLE "RouteAssignment" (
    "id" TEXT NOT NULL,
    "promoterId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RouteAssignment_promoterId_idx" ON "RouteAssignment"("promoterId");

-- CreateIndex
CREATE INDEX "RouteAssignment_storeId_idx" ON "RouteAssignment"("storeId");

-- CreateIndex
CREATE INDEX "RouteAssignment_isActive_idx" ON "RouteAssignment"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RouteAssignment_promoterId_storeId_key" ON "RouteAssignment"("promoterId", "storeId");

-- AddForeignKey
ALTER TABLE "RouteAssignment" ADD CONSTRAINT "RouteAssignment_promoterId_fkey" FOREIGN KEY ("promoterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteAssignment" ADD CONSTRAINT "RouteAssignment_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
