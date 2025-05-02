/*
  Warnings:

  - You are about to drop the column `requestTypeId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "StudentAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "studentNo" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "createdAtDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "requestTypeId" TEXT,
    "studentAccountId" TEXT,
    CONSTRAINT "Request_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Request_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES "RequestType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Request_studentAccountId_fkey" FOREIGN KEY ("studentAccountId") REFERENCES "StudentAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("assignedToId", "createdAt", "createdAtDate", "departmentId", "id", "message", "phone", "requestNumber", "requestTypeId", "status", "studentName") SELECT "assignedToId", "createdAt", "createdAtDate", "departmentId", "id", "message", "phone", "requestNumber", "requestTypeId", "status", "studentName" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
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

-- CreateIndex
CREATE UNIQUE INDEX "StudentAccount_phone_key" ON "StudentAccount"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAccount_studentNo_key" ON "StudentAccount"("studentNo");
