import { injectable, inject } from 'tsyringe';

import path from 'path';
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider';
import { format } from 'date-fns';
import IGiftCardRequestsRepository from '../../../repositories/IGiftCardRequestsRepository';

interface IRequest {
  provider_id: string;
  start_date: Date;
  end_date: Date;
  gift_card_id?: string;
  status?: string;
}

interface IResponse {
  id: string;
  created_at: string;
  user_name: string;
  reward_title: string;
  status: string;
}

const status_format = {
  pending_approval: 'Pendente de aprovação',
  use_available: 'Disponível para utilização',
  used: 'Utilizado',
  reproved: 'Recusado',
};

@injectable()
class GiftCardRequestsToPDFService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
    @inject('PDFProvider')
    private pdfProvider: IPDFProvider,
  ) {}

  public async execute({
    provider_id,
    start_date,
    end_date,
    gift_card_id,
    status,
  }: IRequest): Promise<Buffer> {
    const result = await this.giftCardRequestsRepository.findByProviderAndDate(
      provider_id,
      start_date,
      end_date,
      gift_card_id,
      status,
    );

    const gift_card_requests = result.map(
      r =>
        ({
          id: r.id,
          created_at: format(r.created_at, 'dd/MM/yyyy'),
          user_name: r.user.name,
          reward_title: r.gift_card.title,
          status: status_format[r.status],
        } as IResponse),
    );

    const gift_card_template = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'views',
      'provider_gift_card_requests_pdf.hbs',
    );

    return this.pdfProvider.generatePDF({
      templateData: {
        file: gift_card_template,
        variables: {
          gift_card_requests,
        },
      },
    });
  }
}

export default GiftCardRequestsToPDFService;
