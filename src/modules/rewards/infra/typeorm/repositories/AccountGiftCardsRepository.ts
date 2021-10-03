import IAccountGiftCardsRepository from '@modules/rewards/repositories/IAccountGiftCardsRepository';
import { getRepository, Repository } from 'typeorm';

import AccountGiftCard from '../entities/AccountGiftCard';

class AccountGiftCardsRepository implements IAccountGiftCardsRepository {
  private ormRepository: Repository<AccountGiftCard>;

  constructor() {
    this.ormRepository = getRepository(AccountGiftCard);
  }

  public async findByAccount(account_id: string): Promise<AccountGiftCard[]> {
    const account_gift_cards = await this.ormRepository.find({
      where: {
        account_id,
      },
    });
    return account_gift_cards;
  }

  public async findById(
    account_id: string,
    gift_card_id: string,
  ): Promise<AccountGiftCard | undefined> {
    const account_gift_card = await this.ormRepository.find({
      where: {
        account_id,
        gift_card_id,
      },
    });
    return account_gift_card[0];
  }

  public async create(
    account_id: string,
    gift_card_id: string,
  ): Promise<AccountGiftCard> {
    const account_gift_card = this.ormRepository.create({
      account_id,
      gift_card_id,
    });

    await this.ormRepository.save(account_gift_card);

    return account_gift_card;
  }

  public async save(
    account_gift_card: AccountGiftCard,
  ): Promise<AccountGiftCard> {
    return this.ormRepository.save(account_gift_card);
  }

  public async remove(account_gift_card: AccountGiftCard): Promise<void> {
    await this.ormRepository.remove(account_gift_card);
  }
}

export default AccountGiftCardsRepository;
