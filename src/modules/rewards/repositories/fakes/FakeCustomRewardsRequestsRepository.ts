import { uuid } from 'uuidv4';

import ICreateCustomRewardRequestDTO from '@modules/rewards/dtos/ICreateCustomRewardRequestDTO';
import CustomRewardRequest from '../../infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardRequestsRepository from '../ICustomRewardRequestsRepository';

class FakeCustomRewardsRequestsRepository
  implements ICustomRewardRequestsRepository {
  private custom_reward_requests: CustomRewardRequest[] = [];

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
