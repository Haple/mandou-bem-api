import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGiftCardsRepository from '../../repositories/IGiftCardsRepository';

import GiftCard from '../../infra/typeorm/entities/GiftCard';

interface IRequest {
  gift_card_id: string;
  title: string;
  image_url: string;
  points: number;
  provider_id: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

@injectable()
class UpdateGiftCardService {
  constructor(
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
  ) {}

  public async execute({
    gift_card_id,
    title,
    image_url,
    points,
    provider_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<GiftCard> {
    const gift_card = await this.giftCardsRepository.findById(gift_card_id);

    if (!gift_card || gift_card.provider_id !== provider_id) {
      throw new AppError('Gift Card not found.');
    }

    const giftCardWithSameTitle = await this.giftCardsRepository.findByTitle({
      title,
      provider_id,
    });

    if (giftCardWithSameTitle && giftCardWithSameTitle.id !== gift_card_id) {
      throw new AppError('Gift Card title already used.');
    }

    return this.giftCardsRepository.save({
      ...gift_card,
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    });
  }
}

export default UpdateGiftCardService;
