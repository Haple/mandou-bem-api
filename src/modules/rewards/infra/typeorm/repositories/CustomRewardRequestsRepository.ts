import { getRepository, Repository } from 'typeorm';

import ICustomRewardRequestsRepository from '@modules/rewards/repositories/ICustomRewardRequestsRepository';
import ICreateCustomRewardRequestDTO from '@modules/rewards/dtos/ICreateCustomRewardRequestDTO';
import IPaginationDTO from '@modules/rewards/dtos/IPaginationDTO';
import { endOfDay, startOfDay } from 'date-fns';
import CustomRewardRequest from '../entities/CustomRewardRequest';

class CustomRewardRequestsRepository
  implements ICustomRewardRequestsRepository {
  private ormRepository: Repository<CustomRewardRequest>;

  constructor() {
    this.ormRepository = getRepository(CustomRewardRequest);
  }

  public async findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
  ): Promise<IPaginationDTO<CustomRewardRequest>> {
    const [reward_requests, total] = await this.ormRepository
      .createQueryBuilder('crr')
      .innerJoinAndSelect('crr.user', 'user')
      .innerJoinAndSelect('user.department', 'department')
      .innerJoinAndSelect('user.position', 'position')
      .innerJoinAndSelect('crr.custom_reward', 'custom_reward')
      .where(
        'crr.account_id = :account_id' +
          ' AND crr.created_at >= :start AND crr.created_at < :end' +
          ' AND (:department_id::text is null OR user.department_id = :department_id)' +
          ' AND (:position_id::text is null OR user.position_id = :position_id)',
        {
          account_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          department_id,
          position_id,
        },
      )
      .orderBy('crr.created_at', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      total,
      result: reward_requests,
    };
  }

  public async findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
  ): Promise<CustomRewardRequest[]> {
    const reward_requests = await this.ormRepository
      .createQueryBuilder('crr')
      .innerJoinAndSelect('crr.user', 'user')
      .innerJoinAndSelect('user.department', 'department')
      .innerJoinAndSelect('user.position', 'position')
      .innerJoinAndSelect('crr.custom_reward', 'custom_reward')
      .where(
        'crr.account_id = :account_id' +
          ' AND crr.created_at >= :start AND crr.created_at < :end' +
          ' AND (:department_id::text is null OR user.department_id = :department_id)' +
          ' AND (:position_id::text is null OR user.position_id = :position_id)',
        {
          account_id,
          start: startOfDay(startDate).toISOString(),
          end: endOfDay(endDate).toISOString(),
          department_id,
          position_id,
        },
      )
      .orderBy('crr.created_at', 'DESC')
      .getMany();

    return reward_requests;
  }

  public async findById(id: string): Promise<CustomRewardRequest | undefined> {
    const rewardRequest = await this.ormRepository.findOne(id);

    return rewardRequest;
  }

  public async findAllFromAccount(
    account_id: string,
    status?: string,
  ): Promise<CustomRewardRequest[]> {
    if (status) {
      return this.ormRepository.find({
        where: {
          account_id,
          status,
        },
      });
    }
    return this.ormRepository.find({
      where: {
        account_id,
      },
    });
  }

  public async create(
    reward_request_data: ICreateCustomRewardRequestDTO,
  ): Promise<CustomRewardRequest> {
    const reward_request = this.ormRepository.create(reward_request_data);

    await this.ormRepository.save(reward_request);

    return reward_request;
  }

  public async save(
    reward_request: CustomRewardRequest,
  ): Promise<CustomRewardRequest> {
    return this.ormRepository.save(reward_request);
  }

  public async remove(reward_request: CustomRewardRequest): Promise<void> {
    await this.ormRepository.remove(reward_request);
  }
}

export default CustomRewardRequestsRepository;
