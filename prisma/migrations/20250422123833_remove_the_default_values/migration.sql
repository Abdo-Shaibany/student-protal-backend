-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "departmentId" TEXT NOT NULL,
    CONSTRAINT "RequestType_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RequestType" ("departmentId", "id", "name", "totalRequests") SELECT "departmentId", "id", "name", "totalRequests" FROM "RequestType";
DROP TABLE "RequestType";
ALTER TABLE "new_RequestType" RENAME TO "RequestType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
