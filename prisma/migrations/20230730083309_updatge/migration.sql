/*
  Warnings:

  - You are about to drop the column `data` on the `ExchangeCoinInfo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExchangeCoinInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "coinPair" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT '',
    "name_kor" TEXT NOT NULL DEFAULT '',
    "name_eng" TEXT NOT NULL DEFAULT '',
    "warning" BOOLEAN NOT NULL DEFAULT false,
    "trading" BOOLEAN NOT NULL DEFAULT false,
    "deposit" BOOLEAN NOT NULL DEFAULT false,
    "withdraw" BOOLEAN NOT NULL DEFAULT false,
    "numOfDepositConfirm" INTEGER NOT NULL DEFAULT -1,
    "numOfWithdrawConfirm" INTEGER NOT NULL DEFAULT -1,
    "limitTradingFee" REAL NOT NULL DEFAULT 0.0,
    "marketTradingFee" REAL NOT NULL DEFAULT 0.0,
    "depositFee" REAL NOT NULL DEFAULT 0.0,
    "withdrawFee" REAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_ExchangeCoinInfo" ("coinPair", "exchange", "id", "market", "symbol") SELECT "coinPair", "exchange", "id", "market", "symbol" FROM "ExchangeCoinInfo";
DROP TABLE "ExchangeCoinInfo";
ALTER TABLE "new_ExchangeCoinInfo" RENAME TO "ExchangeCoinInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
