import AccountGiftCard from '../infra/typeorm/entities/AccountGiftCard';

export default interface IAccountGiftCardsRepository {
  findByAccount(account_id: string): Promise<AccountGiftCard[]>;
  findById(
    account_id: string,
    gift_card_id: string,
  ): Promise<AccountGiftCard | undefined>;
  create(account_id: string, gift_card_id: string): Promise<AccountGiftCard>;
  save(gift_card_request: AccountGiftCard): Promise<AccountGiftCard>;
  remove(gift_card_request: AccountGiftCard): Promise<void>;
}
