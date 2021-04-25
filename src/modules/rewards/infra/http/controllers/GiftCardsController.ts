import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateGiftCardService from '@modules/rewards/services/gift_cards/CreateGiftCardService';
import UpdateGiftCardService from '@modules/rewards/services/gift_cards/UpdateGiftCardService';
import DeleteGiftCardService from '@modules/rewards/services/gift_cards/DeleteGiftCardService';
import GiftCardsRepository from '../../typeorm/repositories/GiftCardsRepository';

export default class GiftCardController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    } = request.body;
    const { id } = request.provider;

    const createGiftCard = container.resolve(CreateGiftCardService);

    const gift_card = await createGiftCard.execute({
      title,
      image_url,
      points,
      provider_id: id,
      units_available,
      expiration_days,
      description,
    });

    return response.json(classToClass(gift_card));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.provider;

    const giftCardsRepository = container.resolve(GiftCardsRepository);

    const gift_cards = await giftCardsRepository.findAllFromAccount(id);

    return response.json(classToClass(gift_cards));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { gift_card_id } = request.params;
    const { id } = request.provider;

    const deleteGiftCard = container.resolve(DeleteGiftCardService);

    await deleteGiftCard.execute({
      provider_id: id,
      gift_card_id,
    });

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { gift_card_id } = request.params;
    const {
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    } = request.body;
    const { id } = request.provider;

    const updateGiftCard = container.resolve(UpdateGiftCardService);

    const gift_card = await updateGiftCard.execute({
      gift_card_id,
      title,
      image_url,
      points,
      provider_id: id,
      units_available,
      expiration_days,
      description,
    });

    return response.json(classToClass(gift_card));
  }
}
