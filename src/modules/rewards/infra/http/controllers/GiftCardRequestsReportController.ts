import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListGiftCardRequestsService from '@modules/rewards/services/reports/provider/ListGiftCardRequestsService';
import GiftCardRequestsToPDFService from '@modules/rewards/services/reports/provider/GiftCardRequestsToPDFService';

export default class GiftCardRequestsReportController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: provider_id } = request.provider;
    const start_date = (request.query.start_date as unknown) as Date;
    const end_date = (request.query.end_date as unknown) as Date;
    const page = (request.query.page as unknown) as number;
    const size = (request.query.size as unknown) as number;
    const gift_card_id = (request.query.gift_card_id as unknown) as string;
    const status = (request.query.status as unknown) as string;

    const listGiftCardRequests = container.resolve(ListGiftCardRequestsService);

    const result = await listGiftCardRequests.execute({
      provider_id,
      start_date,
      end_date,
      page,
      size,
      gift_card_id,
      status,
    });

    return response.json(classToClass(result));
  }

  public async downloadPDF(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { id: provider_id } = request.provider;
    const start_date = (request.query.start_date as unknown) as Date;
    const end_date = (request.query.end_date as unknown) as Date;
    const gift_card_id = (request.query.gift_card_id as unknown) as string;
    const status = (request.query.status as unknown) as string;

    const giftCardRequestsToPDF = container.resolve(
      GiftCardRequestsToPDFService,
    );

    const pdf = await giftCardRequestsToPDF.execute({
      provider_id,
      start_date,
      end_date,
      gift_card_id,
      status,
    });

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
    });
    response.send(pdf);
  }
}
