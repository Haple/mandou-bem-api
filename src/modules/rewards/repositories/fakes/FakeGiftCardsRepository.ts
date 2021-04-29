import { uuid } from 'uuidv4';

import ICreateGiftCardDTO from '@modules/rewards/dtos/ICreateGiftCardDTO';
import IFindGiftCardByTitleDTO from '@modules/rewards/dtos/IFindGiftCardByTitleDTO';
import GiftCard from '../../infra/typeorm/entities/GiftCard';
import IGiftCardsRepository from '../IGiftCardsRepository';

class FakeGiftCardsRepository implements IGiftCardsRepository {
  private gift_cards: GiftCard[] = [];

  public async findById(id: string): Promise<GiftCard | undefined> {
    const gift_card = this.gift_cards.find(g => g.id === id);

    return gift_card;
  }

  public async findByTitle({
    provider_id,
    title,
  }: IFindGiftCardByTitleDTO): Promise<GiftCard | undefined> {
    return this.gift_cards.filter(
      gift_card =>
        gift_card.provider_id === provider_id && gift_card.title === title,
    )[0];
  }

  public async findAllFromAccount(provider_id: string): Promise<GiftCard[]> {
    return this.gift_cards.filter(
      gift_card => gift_card.provider_id === provider_id,
    );
  }

  public async findAll(): Promise<GiftCard[]> {
    return this.gift_cards;
  }

  public async create(gift_card_data: ICreateGiftCardDTO): Promise<GiftCard> {
    const gift_card = new GiftCard();

    Object.assign(
      gift_card,
      { id: uuid() },
      { provider: { company_name: 'fake-company-name' } },
      gift_card_data,
    );

    this.gift_cards.push(gift_card);

    return gift_card;
  }

  public async save(gift_card: GiftCard): Promise<GiftCard> {
    const find_index = this.gift_cards.findIndex(
      find_gift_card => find_gift_card.id === gift_card.id,
    );

    this.gift_cards[find_index] = gift_card;

    return gift_card;
  }

  public async remove(gift_card: GiftCard): Promise<void> {
    this.gift_cards.splice(this.gift_cards.indexOf(gift_card), 1);
  }
}

export default FakeGiftCardsRepository;
