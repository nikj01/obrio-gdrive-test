import { Readable } from "stream";
import { BulkJobOptions } from "bullmq";

export interface BullUploadFileJob {
  name: string;
  data: { url: string; fileId: string; fileOwnerId: string; uploadSessionId: string };
  opts?: BulkJobOptions;
}

export interface UploadFileJobData {
  url: string;
  fileId: string;
  fileOwnerId: string;
  uploadSessionId: string;
}

export interface SuccessfulFileUploadData {
  fileId: string;
  originalFilename: string;
  storageFileId: string;
  storageDownloadUrl: string;
  storageViewUrl: string;
  fileSize: number | undefined;
  mimeType: string | undefined;
  hash: string;
  jobRecordId: string;
  uploadSessionId: string;
}

export interface FailedFileUploadData {
  jobRecordId: string;
  fileId: string;
  uploadSessionId: string;
  errorMessage: string;
}

export interface TransferFileMetadata {
  nodeStream: Readable;
  filename: string;
  mimeType?: string;
  size?: number;
}
