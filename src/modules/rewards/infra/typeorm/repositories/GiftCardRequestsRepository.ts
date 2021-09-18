import { getRepository, Repository } from 'typeorm';

import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import ICreateGiftCardRequestDTO from '@modules/rewards/dtos/ICreateGiftCardRequestDTO';
import IPaginationDTO from '@modules/rewards/dtos/IPaginationDTO';
import { endOfDay, startOfDay } from 'date-fns';
import ICountByWeekDTO from '@modules/rewards/dtos/ICountByWeekDTO';
import ICountByGiftCardDTO from '@modules/rewards/dtos/ICountByGiftCardDTO';
import GiftCardRequest from '../entities/GiftCardRequest';

class GiftCardRequestsRepository implements IGiftCardRequestsRepository {
  private ormRepository: Repository<GiftCardRequest>;

  constructor() {
    this.ormRepository = getRepository(GiftCardRequest);
  }

  public async countWeeklyRequests(
    provider_id: string,
  ): Promise<ICountByWeekDTO[]> {
    const result = await this.ormRepository
      .createQueryBuilder('gcr')
      .select('count(*)', 'count')
      .addSelect("date_trunc('week', gcr.created_at)", 'week_date')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .where(
        'gift_card.provider_id = :provider_id' +
          " AND gcr.created_at >= current_date - interval '30' day",
        { provider_id },
      )
      .groupBy('week_date')
      .addGroupBy('gift_card.id')
      .getRawMany();
    return result;
  }

  public async countWeeklyValidations(
    provider_id: string,
  ): Promise<ICountByWeekDTO[]> {
    const result = await this.ormRepository
      .createQueryBuilder('gcr')
      .select('count(*)', 'count')
      .addSelect("date_trunc('week', gcr.updated_at)", 'week_date')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .where(
        'gift_card.provider_id = :provider_id' +
          " AND gcr.updated_at >= current_date - interval '30' day" +
          " AND gcr.status = 'used'",
        { provider_id },
      )
      .groupBy('week_date')
      .addGroupBy('gift_card.id')
      .getRawMany();
    return result;
  }

  public async countLastGiftCardRequests(
    provider_id: string,
  ): Promise<ICountByGiftCardDTO[]> {
    const result = await this.ormRepository
      .createQueryBuilder('gcr')
      .select('count(*)', 'count')
      .addSelect('gift_card.title', 'title')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .where(
        'gift_card.provider_id = :provider_id' +
          " AND gcr.created_at >= current_date - interval '30' day",
        { provider_id },
      )
      .groupBy('title')
      .addGroupBy('gift_card.id')
      .getRawMany();
    return result;
  }

  public async findByProviderAndDate(
    provider_id: string,
    startDate: Date,
    endDate: Date,
    gift_card_id?: string,
    status?: string,
  ): Promise<GiftCardRequest[]> {
    const gift_card_requests = await this.ormRepository
      .createQueryBuilder('gcr')
      .innerJoinAndSelect('gcr.user', 'user')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .innerJoinAndSelect('gift_card.provider', 'provider')
      .where(
        'gift_card.provider_id = :provider_id' +
          ' AND gcr.created_at >= :start AND gcr.created_at < :end' +
          ' AND (:gift_card_id::text is null OR gcr.gift_card_id = :gift_card_id)' +
          ' AND (:status::text is null OR gcr.status = :status)',
        {
          provider_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          gift_card_id,
          status,
        },
      )
      .orderBy('gcr.created_at', 'DESC')
      .getMany();
    return gift_card_requests;
  }

  public async findByProviderAndDatePaginated(
    provider_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    gift_card_id?: string,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>> {
    const [gift_card_requests, total] = await this.ormRepository
      .createQueryBuilder('gcr')
      .innerJoinAndSelect('gcr.user', 'user')
      .innerJoinAndSelect('gcr.gift_card', 'gift_card')
      .innerJoinAndSelect('gift_card.provider', 'provider')
      .where(
        'gift_card.provider_id = :provider_id' +
          ' AND gcr.created_at >= :start AND gcr.created_at < :end' +
          ' AND (:gift_card_id::text is null OR gcr.gift_card_id = :gift_card_id)' +
          ' AND (:status::text is null OR gcr.status = :status)',
        {
          provider_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          gift_card_id,
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
