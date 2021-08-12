import { uuid } from 'uuidv4';

import ICreateCustomRewardRequestDTO from '@modules/rewards/dtos/ICreateCustomRewardRequestDTO';
import IPaginationDTO from '@modules/rewards/dtos/IPaginationDTO';
import { isAfter, isBefore } from 'date-fns';
import CustomRewardRequest from '../../infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardRequestsRepository from '../ICustomRewardRequestsRepository';

class FakeCustomRewardsRequestsRepository
  implements ICustomRewardRequestsRepository {
  private custom_reward_requests: CustomRewardRequest[] = [];

  public async findByUserAndDatePaginated(
    user_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
  ): Promise<IPaginationDTO<CustomRewardRequest>> {
    const indexMin = page * size;
    const indexMax = indexMin + size;
    const custom_reward_requests = this.custom_reward_requests.filter(
      (crr, index) =>
        index >= indexMin &&
        index < indexMax &&
        crr.user_id === user_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate),
    );
    return {
      total: custom_reward_requests.length,
      result: custom_reward_requests,
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
  ): Promise<IPaginationDTO<CustomRewardRequest>> {
    const indexMin = page * size;
    const indexMax = indexMin + size;
    const custom_reward_requests = this.custom_reward_requests.filter(
      (crr, index) =>
        index >= indexMin &&
        index < indexMax &&
        crr.account_id === account_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate) &&
        (department_id ? crr.user.department_id === department_id : true) &&
        (position_id ? crr.user.position_id === position_id : true),
    );
    return {
      total: custom_reward_requests.length,
      result: custom_reward_requests,
    };
  }

  public async findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
  ): Promise<CustomRewardRequest[]> {
    const custom_reward_requests = this.custom_reward_requests.filter(
      crr =>
        crr.account_id === account_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate) &&
        (department_id ? crr.user.department_id === department_id : true) &&
        (position_id ? crr.user.position_id === position_id : true),
    );
    return custom_reward_requests;
  }

  public async findById(id: string): Promise<CustomRewardRequest | undefined> {
    const custom_reward_request = this.custom_reward_requests.find(
      c => c.id === id,
    );

    return custom_reward_request;
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<CustomRewardRequest[]> {
    return this.custom_reward_requests.filter(
      reward_request => reward_request.account_id === account_id,
    );
  }

  public async create(
    reward_request_data: ICreateCustomRewardRequestDTO,
  ): Promise<CustomRewardRequest> {
    const custom_reward_request = new CustomRewardRequest();

    Object.assign(custom_reward_request, { id: uuid() }, reward_request_data);

    this.custom_reward_requests.push(custom_reward_request);

    return custom_reward_request;
  }

  public async save(
    custom_reward_request: CustomRewardRequest,
  ): Promise<CustomRewardRequest> {
    const find_index = this.custom_reward_requests.findIndex(
      find_reward_request =>
        find_reward_request.id === custom_reward_request.id,
    );

    if (find_index === -1) {
      this.custom_reward_requests.push(custom_reward_request);
      return custom_reward_request;
    }

    this.custom_reward_requests[find_index] = custom_reward_request;

    return custom_reward_request;
  }

  public async remove(
    custom_reward_request: CustomRewardRequest,
  ): Promise<void> {
    this.custom_reward_requests.splice(
      this.custom_reward_requests.indexOf(custom_reward_request),
      1,
    );
  }
}

export default FakeCustomRewardsRequestsRepository;
