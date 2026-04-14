-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pokemon" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "setName" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "owned" BOOLEAN NOT NULL DEFAULT false,
    "purchasePrice" REAL,
    "currentPrice" REAL,
    "condition" TEXT,
    "acquiredDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Card_pokemon_idx" ON "Card"("pokemon");

-- CreateIndex
CREATE INDEX "Card_owned_idx" ON "Card"("owned");

-- CreateIndex
CREATE INDEX "Card_setName_idx" ON "Card"("setName");
