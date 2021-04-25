import GiftCard from '../infra/typeorm/entities/GiftCard';
import ICreateGiftCardDTO from '../dtos/ICreateGiftCardDTO';
import IFindGiftCardByTitleDTO from '../dtos/IFindGiftCardByTitleDTO';

export default interface IGiftCardsRepository {
  findAllFromAccount(provider_id: string): Promise<GiftCard[]>;
  findById(id: string): Promise<GiftCard | undefined>;
  findByTitle(data: IFindGiftCardByTitleDTO): Promise<GiftCard | undefined>;
  create(data: ICreateGiftCardDTO): Promise<GiftCard>;
  save(gift_card: GiftCard): Promise<GiftCard>;
  remove(gift_card: GiftCard): Promise<void>;
}
