import { container } from 'tsyringe';

import IQRCodeProvider from './models/IQRCodeProvider';
import QRCodeProvider from './implementations/QRCodeProvider';

container.registerSingleton<IQRCodeProvider>('QRCodeProvider', QRCodeProvider);
