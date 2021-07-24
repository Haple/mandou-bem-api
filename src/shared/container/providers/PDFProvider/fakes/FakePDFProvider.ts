import IPDFProvider from '../models/IPDFProvider';
import IGeneratePDFDTO from '../dtos/IGeneratePDFDTO';

export default class FakePDFProvider implements IPDFProvider {
  public async generatePDF(message: IGeneratePDFDTO): Promise<Buffer> {
    const buffer = Buffer.alloc(16);
    buffer.write('Hello', 'utf-8');
    return buffer;
  }
}
