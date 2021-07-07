import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateGiftCardRequestService from '@modules/rewards/services/reward_requests/CreateGiftCardRequestService';
import GetGiftCardRequestService from '@modules/rewards/services/reward_requests/GetGiftCardRequestService';
import ValidateGiftCardService from '@modules/rewards/services/reward_requests/ValidateGiftCardService';

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

  public async show(request: Request, response: Response): Promise<Response> {
    const { gift_card_request_id } = request.params;
    const { id: provider_id } = request.provider;

    const getGiftCardRequest = container.resolve(GetGiftCardRequestService);

    const reward_request = await getGiftCardRequest.execute({
      gift_card_request_id,
      provider_id,
    });

    return response.json(classToClass(reward_request));
  }

  public async validate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { gift_card_request_id } = request.params;
    const { id: provider_id } = request.provider;

    const validateGiftCard = container.resolve(ValidateGiftCardService);

    const gift_card_request_updated = await validateGiftCard.execute({
      gift_card_request_id,
      provider_id,
    });

    return response.json(classToClass(gift_card_request_updated));
  }
}
