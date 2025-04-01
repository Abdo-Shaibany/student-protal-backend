/*
  Warnings:

  - You are about to drop the column `requestId` on the `RequestFile` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_RequestToRequestFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RequestToRequestFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RequestToRequestFile_B_fkey" FOREIGN KEY ("B") REFERENCES "RequestFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_RequestFile" ("id", "name", "type", "url") SELECT "id", "name", "type", "url" FROM "RequestFile";
DROP TABLE "RequestFile";
ALTER TABLE "new_RequestFile" RENAME TO "RequestFile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_RequestToRequestFile_AB_unique" ON "_RequestToRequestFile"("A", "B");

-- CreateIndex
CREATE INDEX "_RequestToRequestFile_B_index" ON "_RequestToRequestFile"("B");
