import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 'cloudinary';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
    limits: {
      fileSize: number;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const extension = file.originalname.split('.')[1];
        const fileName = `${fileHash}.${extension}`;

        return callback(null, fileName);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  },
} as IUploadConfig;
