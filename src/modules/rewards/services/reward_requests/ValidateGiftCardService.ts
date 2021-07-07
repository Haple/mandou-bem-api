import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import IGiftCardRequestsRepository from '../../repositories/IGiftCardRequestsRepository';

interface IRequest {
  gift_card_request_id: string;
  provider_id: string;
}

@injectable()
class ValidateGiftCardService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
  ) {}

  public async execute({
    gift_card_request_id,
    provider_id,
  }: IRequest): Promise<GiftCardRequest> {
    const gift_card_request = await this.giftCardRequestsRepository.findById(
      gift_card_request_id,
    );

    if (
      !gift_card_request ||
      gift_card_request.gift_card.provider_id !== provider_id
    ) {
      throw new AppError('Gift card request not found.');
    }

    if (gift_card_request.status !== 'use_available') {
      throw new AppError('Unable to validate gift card.');
    }

    const gift_card_request_updated = await this.giftCardRequestsRepository.save(
      {
        ...gift_card_request,
        status: 'used',
      },
    );

    return gift_card_request_updated;
  }
}

export default ValidateGiftCardService;
