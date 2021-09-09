import { getRepository, Repository } from 'typeorm';

import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import ICreateGiftCardRequestDTO from '@modules/rewards/dtos/ICreateGiftCardRequestDTO';
import IPaginationDTO from '@modules/rewards/dtos/IPaginationDTO';
import { endOfDay, startOfDay } from 'date-fns';
import GiftCardRequest from '../entities/GiftCardRequest';

class GiftCardRequestsRepository implements IGiftCardRequestsRepository {
  private ormRepository: Repository<GiftCardRequest>;

  constructor() {
    this.ormRepository = getRepository(GiftCardRequest);
  }

  public async findByUserAndDatePaginated(
    user_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>> {
    const [gift_card_requests, total] = await this.ormRepository
      .createQueryBuilder('gcr')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .innerJoinAndSelect('gift_card.provider', 'provider')
      .where(
        'gcr.user_id = :user_id' +
          ' AND gcr.created_at >= :start AND gcr.created_at < :end' +
          ' AND (:status::text is null OR gcr.status = :status)',
        {
          user_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          status,
        },
      )
      .orderBy('gcr.created_at', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();
    return {
      total,
      result: gift_card_requests,
    };
  }

  public async findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
    provider_id?: string,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>> {
    const [gift_card_requests, total] = await this.ormRepository
      .createQueryBuilder('gcr')
      .innerJoinAndSelect('gcr.user', 'user')
      .innerJoinAndSelect('user.department', 'department')
      .innerJoinAndSelect('user.position', 'position')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .innerJoinAndSelect('gift_card.provider', 'provider')
      .where(
        'user.account_id = :account_id' +
          ' AND gcr.created_at >= :start AND gcr.created_at < :end' +
          ' AND (:department_id::text is null OR user.department_id = :department_id)' +
          ' AND (:position_id::text is null OR user.position_id = :position_id)' +
          ' AND (:provider_id::text is null OR gift_card.provider_id = :provider_id)' +
          ' AND (:status::text is null OR gcr.status = :status)',
        {
          account_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          department_id,
          position_id,
          provider_id,
          status,
        },
      )
      .orderBy('gcr.created_at', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();
    return {
      total,
      result: gift_card_requests,
    };
  }

  public async findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
    provider_id?: string,
    status?: string,
  ): Promise<GiftCardRequest[]> {
    const gift_card_requests = await this.ormRepository
      .createQueryBuilder('gcr')
      .innerJoinAndSelect('gcr.user', 'user')
      .innerJoinAndSelect('user.department', 'department')
      .innerJoinAndSelect('user.position', 'position')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .innerJoinAndSelect('gift_card.provider', 'provider')
      .where(
        'user.account_id = :account_id' +
          ' AND gcr.created_at >= :start AND gcr.created_at < :end' +
          ' AND (:department_id::text is null OR user.department_id = :department_id)' +
          ' AND (:position_id::text is null OR user.position_id = :position_id)' +
          ' AND (:provider_id::text is null OR gift_card.provider_id = :provider_id)' +
          ' AND (:status::text is null OR gcr.status = :status)',
        {
          account_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          department_id,
          position_id,
          provider_id,
          status,
        },
      )
      .orderBy('gcr.created_at', 'DESC')
      .getMany();
    return gift_card_requests;
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
