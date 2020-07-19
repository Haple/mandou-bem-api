import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    console.log(`AHA: ${file}`);

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    const file_url = `${process.env.APP_API_URL}/files/${file}`;

    return file_url;
  }

  public async deleteFile(file: string): Promise<void> {
    // If file has full path, get only the filename
    const filename = file.split('/')[file.split('/').length - 1];

    const filePath = path.resolve(uploadConfig.uploadsFolder, filename);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
