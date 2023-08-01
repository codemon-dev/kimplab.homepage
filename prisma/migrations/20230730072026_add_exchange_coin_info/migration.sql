-- CreateTable
CREATE TABLE "ExchangeCoinInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "coinPair" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
