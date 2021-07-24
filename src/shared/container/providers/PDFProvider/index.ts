import { container } from 'tsyringe';

import IPDFProvider from './models/IPDFProvider';

import PDFProvider from './implementations/PDFProvider';

container.registerSingleton<IPDFProvider>('PDFProvider', PDFProvider);
