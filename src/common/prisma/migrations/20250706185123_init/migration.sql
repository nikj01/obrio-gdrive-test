-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "owner_id" VARCHAR(255) NOT NULL,
    "original_url" VARCHAR(2048) NOT NULL,
    "original_filename" VARCHAR(255),
    "storage_file_id" VARCHAR(255),
    "storage_view_url" VARCHAR(2048),
    "storage_download_url" VARCHAR(2048),
    "file_size" BIGINT,
    "mime_type" VARCHAR(100),
    "hash" VARCHAR(255),
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "upload_session_id" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs_records" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "job_id" BIGINT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "failed_at" TIMESTAMP(3),

    CONSTRAINT "jobs_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_sessions" (
    "id" TEXT NOT NULL,
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
CREATE INDEX "files_upload_session_id_idx" ON "files"("upload_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_records_job_id_key" ON "jobs_records"("job_id");

-- CreateIndex
CREATE INDEX "jobs_records_status_idx" ON "jobs_records"("status");

-- CreateIndex
CREATE INDEX "jobs_records_created_at_idx" ON "jobs_records"("created_at");

-- CreateIndex
CREATE INDEX "jobs_records_file_id_idx" ON "jobs_records"("file_id");

-- CreateIndex
CREATE INDEX "upload_sessions_created_at_idx" ON "upload_sessions"("created_at");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_upload_session_id_fkey" FOREIGN KEY ("upload_session_id") REFERENCES "upload_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs_records" ADD CONSTRAINT "jobs_records_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
