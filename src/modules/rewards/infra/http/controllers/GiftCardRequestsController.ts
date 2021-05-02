import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateGiftCardRequestService from '@modules/rewards/services/reward_requests/CreateGiftCardRequestService';

export default class GiftCardRequestsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { gift_card_id } = request.body;
    const { account_id, id: user_id } = request.user;

    const createCustomRewardRequest = container.resolve(
      CreateGiftCardRequestService,
    );

    const gift_card_request = await createCustomRewardRequest.execute({
      gift_card_id,
      user_id,
      account_id,
    });

    return response.json(classToClass(gift_card_request));
  }
}
