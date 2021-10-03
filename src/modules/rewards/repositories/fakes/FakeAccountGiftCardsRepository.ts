import AccountGiftCard from '../../infra/typeorm/entities/AccountGiftCard';
import IAccountGiftCardsRepository from '../IAccountGiftCardsRepository';

class FakeAccountGiftCardsRepository implements IAccountGiftCardsRepository {
  private account_gift_cards: AccountGiftCard[] = [];

  public async findByAccount(account_id: string): Promise<AccountGiftCard[]> {
    return this.account_gift_cards.filter(
      item => item.account_id === account_id,
    );
  }

  public async findById(
    account_id: string,
    gift_card_id: string,
  ): Promise<AccountGiftCard | undefined> {
    return (
      this.account_gift_cards.filter(
        item =>
          item.account_id === account_id && item.gift_card_id === gift_card_id,
      )[0] || undefined
    );
  }

  public async create(
    account_id: string,
    gift_card_id: string,
  ): Promise<AccountGiftCard> {
    const account_gift_card = new AccountGiftCard();

    Object.assign(account_gift_card, { account_id, gift_card_id });

    this.account_gift_cards.push(account_gift_card);

    return account_gift_card;
  }

  public async save(
    gift_card_request: AccountGiftCard,
  ): Promise<AccountGiftCard> {
    const find_index = this.account_gift_cards.findIndex(
      item =>
        item.account_id === gift_card_request.account_id &&
        item.gift_card_id === gift_card_request.gift_card_id,
    );

    if (find_index === -1) {
      this.account_gift_cards.push(gift_card_request);
      return gift_card_request;
    }

    this.account_gift_cards[find_index] = gift_card_request;

    return gift_card_request;
  }

  public async remove(gift_card_request: AccountGiftCard): Promise<void> {
    this.account_gift_cards.splice(
      this.account_gift_cards.indexOf(gift_card_request),
      1,
    );
  }
}

export default FakeAccountGiftCardsRepository;
