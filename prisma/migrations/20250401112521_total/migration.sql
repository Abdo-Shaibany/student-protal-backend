-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalRequests" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Department" ("id", "name", "totalRequests") SELECT "id", "name", coalesce("totalRequests", 0) AS "totalRequests" FROM "Department";
DROP TABLE "Department";
ALTER TABLE "new_Department" RENAME TO "Department";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "departmentId" TEXT,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("departmentId", "id", "isAdmin", "name", "password", "phone", "totalRequests") SELECT "departmentId", "id", "isAdmin", "name", "password", "phone", "totalRequests" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
