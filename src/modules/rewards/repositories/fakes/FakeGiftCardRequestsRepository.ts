import { uuid } from 'uuidv4';

import ICreateGiftCardRequestDTO from '@modules/rewards/dtos/ICreateGiftCardRequestDTO';
import GiftCardRequest from '../../infra/typeorm/entities/GiftCardRequest';
import IGiftCardRequestsRepository from '../IGiftCardRequestsRepository';

class FakeGiftCardRequestsRepository implements IGiftCardRequestsRepository {
  private gift_card_requests: GiftCardRequest[] = [];

  public async findById(id: string): Promise<GiftCardRequest | undefined> {
    const gift_card_request = this.gift_card_requests.find(g => g.id === id);

    return gift_card_request;
  }

  public async create(
    gift_card_request_data: ICreateGiftCardRequestDTO,
  ): Promise<GiftCardRequest> {
    const gift_card_request = new GiftCardRequest();

    Object.assign(gift_card_request, { id: uuid() }, gift_card_request_data);

    this.gift_card_requests.push(gift_card_request);

    return gift_card_request;
  }

  public async save(
    gift_card_request: GiftCardRequest,
  ): Promise<GiftCardRequest> {
    const find_index = this.gift_card_requests.findIndex(
      find_gift_card_request =>
        find_gift_card_request.id === gift_card_request.id,
    );

    this.gift_card_requests[find_index] = gift_card_request;

    return gift_card_request;
  }
}

export default FakeGiftCardRequestsRepository;
