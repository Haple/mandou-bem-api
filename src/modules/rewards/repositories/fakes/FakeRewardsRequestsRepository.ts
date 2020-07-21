import { uuid } from 'uuidv4';

import ICreateRewardRequestDTO from '@modules/rewards/dtos/ICreateRewardRequestDTO';
import RewardRequest from '../../infra/typeorm/entities/RewardRequest';
import IRewardRequestsRepository from '../IRewardRequestsRepository';

class FakeRewardsRequestsRepository implements IRewardRequestsRepository {
  private reward_requests: RewardRequest[] = [];

  public async findById(id: string): Promise<RewardRequest | undefined> {
    const reward_request = this.reward_requests.find(c => c.id === id);

    return reward_request;
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<RewardRequest[]> {
    return this.reward_requests.filter(
      reward_request => reward_request.account_id === account_id,
    );
  }

  public async create(
    reward_request_data: ICreateRewardRequestDTO,
  ): Promise<RewardRequest> {
    const reward_request = new RewardRequest();

    Object.assign(reward_request, { id: uuid() }, reward_request_data);

    this.reward_requests.push(reward_request);

    return reward_request;
  }

  public async save(reward_request: RewardRequest): Promise<RewardRequest> {
    const find_index = this.reward_requests.findIndex(
      find_reward_request => find_reward_request.id === reward_request.id,
    );

    this.reward_requests[find_index] = reward_request;

    return reward_request;
  }

  public async remove(reward_request: RewardRequest): Promise<void> {
    this.reward_requests.splice(
      this.reward_requests.indexOf(reward_request),
      1,
    );
  }
}

export default FakeRewardsRequestsRepository;
