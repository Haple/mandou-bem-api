import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';

interface IRequest {
  gift_card_request_id: string;
  provider_id: string;
}

@injectable()
class GetGiftCardRequestService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
  ) {}

  public async execute({
    gift_card_request_id,
    provider_id,
  }: IRequest): Promise<GiftCardRequest> {
    const reward_request = await this.giftCardRequestsRepository.findById(
      gift_card_request_id,
    );

    if (
      !reward_request ||
      reward_request.gift_card.provider_id !== provider_id
    ) {
      throw new AppError('Gift card request not found.');
    }

    return reward_request;
  }
}

export default GetGiftCardRequestService;
