import { Readable } from "stream";

export interface UploadFileToStorageData {
  filename: string;
  stream: Readable;
  mimeType?: string;
  folderId?: string;
}

export interface UploadFileToStorageResult {
  id: string;
  name: string;
  viewUrl: string;
  downloadUrl?: string;
}

export abstract class IStorageService {
  abstract uploadFile(data: UploadFileToStorageData): Promise<UploadFileToStorageResult>;
}
