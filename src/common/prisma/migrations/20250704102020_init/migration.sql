-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'DOWNLOADING', 'UPLOADING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('WAITING', 'ACTIVE', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "original_url" VARCHAR(2048) NOT NULL,
    "original_filename" VARCHAR(255),
    "google_drive_id" VARCHAR(255),
    "google_drive_url" VARCHAR(2048),
    "file_size" BIGINT,
    "mime_type" VARCHAR(100),
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_jobs" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "job_id" VARCHAR(255),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "JobStatus" NOT NULL DEFAULT 'WAITING',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "download_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_sessions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "total_files" INTEGER NOT NULL,
    "completed_files" INTEGER NOT NULL DEFAULT 0,
    "failed_files" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "files_status_idx" ON "files"("status");

-- CreateIndex
CREATE INDEX "files_created_at_idx" ON "files"("created_at");

-- CreateIndex
CREATE INDEX "files_original_url_idx" ON "files"("original_url");

-- CreateIndex
CREATE INDEX "download_jobs_status_idx" ON "download_jobs"("status");

-- CreateIndex
CREATE INDEX "download_jobs_created_at_idx" ON "download_jobs"("created_at");

-- CreateIndex
CREATE INDEX "download_jobs_file_id_idx" ON "download_jobs"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "upload_sessions_session_id_key" ON "upload_sessions"("session_id");

-- CreateIndex
CREATE INDEX "upload_sessions_session_id_idx" ON "upload_sessions"("session_id");

-- CreateIndex
CREATE INDEX "upload_sessions_created_at_idx" ON "upload_sessions"("created_at");

-- AddForeignKey
ALTER TABLE "download_jobs" ADD CONSTRAINT "download_jobs_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
