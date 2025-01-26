-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "catetoryId" INTEGER,
    "artStudioId" INTEGER,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_catetoryId_fkey" FOREIGN KEY ("catetoryId") REFERENCES "Catetory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_artStudioId_fkey" FOREIGN KEY ("artStudioId") REFERENCES "ArtStudio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("artStudioId", "catetoryId", "created_at", "description", "id", "photo", "price", "status", "title", "updated_at", "userId") SELECT "artStudioId", "catetoryId", "created_at", "description", "id", "photo", "price", "status", "title", "updated_at", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
