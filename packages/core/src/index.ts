export interface StoragePort {
  upload(key: string, buffer: Buffer): Promise<string>;
  getDownloadUrl(key: string): Promise<string>;
  delete(key: string): Promise<void>;
}

