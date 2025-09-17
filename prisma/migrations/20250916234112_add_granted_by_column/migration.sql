/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Access` table. All the data in the column will be lost.
  - Added the required column `grantedBy` to the `Access` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Access" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "grantedBy" INTEGER NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    CONSTRAINT "Access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Access_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Access_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Access" ("expiresAt", "id", "resourceId", "revokedAt", "userId") SELECT "expiresAt", "id", "resourceId", "revokedAt", "userId" FROM "Access";
DROP TABLE "Access";
ALTER TABLE "new_Access" RENAME TO "Access";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
