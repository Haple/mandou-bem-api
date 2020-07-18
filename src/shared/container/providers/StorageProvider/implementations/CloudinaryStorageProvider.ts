import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class CloudinaryStorageProvider implements IStorageProvider {
  private client: typeof cloudinary.v2;

  constructor() {
    this.client = cloudinary.v2;
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const uploadResult = await this.client.uploader.upload(originalPath);

    await fs.promises.unlink(originalPath);

    return uploadResult.url;
  }

  public async deleteFile(file: string): Promise<void> {
    // If file has full path, get only the filename
    const filename = file.split('/')[file.split('/').length - 1];
    // The id is the filename without the extension
    const id = filename.split('.')[0];
    await this.client.api.delete_resources([id]);
  }
}

export default CloudinaryStorageProvider;
