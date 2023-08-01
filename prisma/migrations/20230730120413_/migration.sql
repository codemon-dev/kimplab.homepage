-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExchangeCoinInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "coinPair" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "network" TEXT,
    "name_kor" TEXT,
    "name_eng" TEXT,
    "warning" BOOLEAN,
    "trading" BOOLEAN,
    "deposit" BOOLEAN,
    "withdraw" BOOLEAN,
    "numOfDepositConfirm" INTEGER,
    "numOfWithdrawConfirm" INTEGER,
    "limitTradingFee" REAL,
    "marketTradingFee" REAL,
    "depositFee" REAL,
    "withdrawFee" REAL
);
INSERT INTO "new_ExchangeCoinInfo" ("coinPair", "deposit", "depositFee", "exchange", "id", "limitTradingFee", "market", "marketTradingFee", "name_eng", "name_kor", "network", "numOfDepositConfirm", "numOfWithdrawConfirm", "symbol", "trading", "warning", "withdraw", "withdrawFee") SELECT "coinPair", "deposit", "depositFee", "exchange", "id", "limitTradingFee", "market", "marketTradingFee", "name_eng", "name_kor", "network", "numOfDepositConfirm", "numOfWithdrawConfirm", "symbol", "trading", "warning", "withdraw", "withdrawFee" FROM "ExchangeCoinInfo";
DROP TABLE "ExchangeCoinInfo";
ALTER TABLE "new_ExchangeCoinInfo" RENAME TO "ExchangeCoinInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
