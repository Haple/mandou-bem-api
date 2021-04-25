import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IGiftCardsRepository from '../../repositories/IGiftCardsRepository';

import GiftCard from '../../infra/typeorm/entities/GiftCard';

interface IRequest {
  title: string;
  image_url: string;
  points: number;
  provider_id: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

@injectable()
class CreateGiftCardService {
  constructor(
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
  ) {}

  public async execute({
    title,
    image_url,
    points,
    provider_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<GiftCard> {
    const giftCardWithSameTitle = await this.giftCardsRepository.findByTitle({
      title,
      provider_id,
    });

    if (giftCardWithSameTitle) {
      throw new AppError('Gift Card title already used.');
    }

    const gift_card = await this.giftCardsRepository.create({
      title,
      image_url,
      points,
      provider_id,
      units_available,
      expiration_days,
      description,
    });

    return gift_card;
  }
}

export default CreateGiftCardService;
