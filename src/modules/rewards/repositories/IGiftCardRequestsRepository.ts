import GiftCardRequest from '../infra/typeorm/entities/GiftCardRequest';
import ICreateGiftCardRequestDTO from '../dtos/ICreateGiftCardRequestDTO';

export default interface IGiftCardRequestsRepository {
  findById(id: string): Promise<GiftCardRequest | undefined>;
  create(data: ICreateGiftCardRequestDTO): Promise<GiftCardRequest>;
  save(gift_card_request: GiftCardRequest): Promise<GiftCardRequest>;
}
