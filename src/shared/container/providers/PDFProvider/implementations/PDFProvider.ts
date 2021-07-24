import { inject, injectable } from 'tsyringe';

import ITemplateProvider from '@shared/container/providers/TemplateProvider/models/ITemplateProvider';
import pdf from 'html-pdf';
import IPDFProvider from '../models/IPDFProvider';
import IGeneratePDFDTO from '../dtos/IGeneratePDFDTO';

@injectable()
export default class PDFProvider implements IPDFProvider {
  constructor(
    @inject('TemplateProvider')
    private templateProvider: ITemplateProvider,
  ) {}

  public async generatePDF({ templateData }: IGeneratePDFDTO): Promise<Buffer> {
    const htmlContent = await this.templateProvider.parse(templateData);
    const file = pdf.create(htmlContent, {
      type: 'pdf',
      format: 'A4',
      orientation: 'portrait',
    });
    return new Promise(resolve => {
      file.toBuffer((err, buffer) => {
        resolve(buffer);
      });
    });
  }
}
