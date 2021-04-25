import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGiftCardsRepository from '../../repositories/IGiftCardsRepository';

interface IRequest {
  provider_id: string;
  gift_card_id: string;
}

@injectable()
class DeleteGiftCardService {
  constructor(
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
  ) {}

  public async execute({ provider_id, gift_card_id }: IRequest): Promise<void> {
    const gift_card = await this.giftCardsRepository.findById(gift_card_id);

    if (gift_card && gift_card.provider_id === provider_id) {
      await this.giftCardsRepository.remove(gift_card);
      return;
    }

    throw new AppError('Gift Card not found.', 404);
  }
}

export default DeleteGiftCardService;
