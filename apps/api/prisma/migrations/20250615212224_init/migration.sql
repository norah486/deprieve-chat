-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");
