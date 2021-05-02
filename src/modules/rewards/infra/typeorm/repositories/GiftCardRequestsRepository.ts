import { getRepository, Repository } from 'typeorm';

import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import ICreateGiftCardRequestDTO from '@modules/rewards/dtos/ICreateGiftCardRequestDTO';
import GiftCardRequest from '../entities/GiftCardRequest';

class GiftCardRequestsRepository implements IGiftCardRequestsRepository {
  private ormRepository: Repository<GiftCardRequest>;

  constructor() {
    this.ormRepository = getRepository(GiftCardRequest);
  }

  public async findById(id: string): Promise<GiftCardRequest | undefined> {
    const gift_card_request = await this.ormRepository.findOne(id);

    return gift_card_request;
  }

  public async create(
    gift_card_request_data: ICreateGiftCardRequestDTO,
  ): Promise<GiftCardRequest> {
    const gift_card_request = this.ormRepository.create(gift_card_request_data);

    await this.ormRepository.save(gift_card_request);

    return gift_card_request;
  }

  public async save(
    gift_card_request: GiftCardRequest,
  ): Promise<GiftCardRequest> {
    return this.ormRepository.save(gift_card_request);
  }
}

export default GiftCardRequestsRepository;
