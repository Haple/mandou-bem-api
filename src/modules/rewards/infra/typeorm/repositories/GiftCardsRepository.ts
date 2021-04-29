import { getRepository, Repository } from 'typeorm';

import IGiftCardsRepository from '@modules/rewards/repositories/IGiftCardsRepository';
import ICreateGiftCardDTO from '@modules/rewards/dtos/ICreateGiftCardDTO';
import IFindGiftCardByTitleDTO from '@modules/rewards/dtos/IFindGiftCardByTitleDTO';
import GiftCard from '../entities/GiftCard';

class GiftCardsRepository implements IGiftCardsRepository {
  private ormRepository: Repository<GiftCard>;

  constructor() {
    this.ormRepository = getRepository(GiftCard);
  }

  public async findByTitle({
    provider_id,
    title,
  }: IFindGiftCardByTitleDTO): Promise<GiftCard | undefined> {
    const gift_card = await this.ormRepository.findOne({
      where: {
        provider_id,
        title,
      },
    });
    return gift_card;
  }

  public async findById(id: string): Promise<GiftCard | undefined> {
    const gift_card = await this.ormRepository.findOne(id);

    return gift_card;
  }

  public async findAllFromAccount(provider_id: string): Promise<GiftCard[]> {
    const gift_cards = await this.ormRepository.find({
      where: {
        provider_id,
      },
    });

    return gift_cards;
  }

  public async findAll(): Promise<GiftCard[]> {
    const gift_cards = await this.ormRepository.find();
    return gift_cards;
  }

  public async create(gift_card_data: ICreateGiftCardDTO): Promise<GiftCard> {
    const gift_card = this.ormRepository.create(gift_card_data);

    await this.ormRepository.save(gift_card);

    return gift_card;
  }

  public async save(gift_card: GiftCard): Promise<GiftCard> {
    return this.ormRepository.save(gift_card);
  }

  public async remove(gift_card: GiftCard): Promise<void> {
    await this.ormRepository.softRemove(gift_card);
  }
}

export default GiftCardsRepository;
