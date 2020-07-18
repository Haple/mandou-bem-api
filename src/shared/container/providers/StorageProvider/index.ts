import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import CloudinaryStorageProvider from './implementations/CloudinaryStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  cloudinary: CloudinaryStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
