-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Like" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "productId"),
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtStudio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ArtStudio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArtStudio" ("created_at", "description", "id", "name", "photo", "status", "updated_at", "userId") SELECT "created_at", "description", "id", "name", "photo", "status", "updated_at", "userId" FROM "ArtStudio";
DROP TABLE "ArtStudio";
ALTER TABLE "new_ArtStudio" RENAME TO "ArtStudio";
CREATE TABLE "new_ArtStudioMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "ArtStudioRoleId" INTEGER NOT NULL,
    "artStudioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ArtStudioMember_ArtStudioRoleId_fkey" FOREIGN KEY ("ArtStudioRoleId") REFERENCES "ArtStudioRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtStudioMember_artStudioId_fkey" FOREIGN KEY ("artStudioId") REFERENCES "ArtStudio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtStudioMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArtStudioMember" ("ArtStudioRoleId", "artStudioId", "created_at", "id", "status", "updated_at", "userId") SELECT "ArtStudioRoleId", "artStudioId", "created_at", "id", "status", "updated_at", "userId" FROM "ArtStudioMember";
DROP TABLE "ArtStudioMember";
ALTER TABLE "new_ArtStudioMember" RENAME TO "ArtStudioMember";
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
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_catetoryId_fkey" FOREIGN KEY ("catetoryId") REFERENCES "Catetory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_artStudioId_fkey" FOREIGN KEY ("artStudioId") REFERENCES "ArtStudio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("artStudioId", "catetoryId", "created_at", "description", "id", "photo", "price", "status", "title", "updated_at", "userId") SELECT "artStudioId", "catetoryId", "created_at", "description", "id", "photo", "price", "status", "title", "updated_at", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
