import { getRepository, Repository } from 'typeorm';

import IRewardRequestsRepository from '@modules/rewards/repositories/IRewardRequestsRepository';
import ICreateRewardRequestDTO from '@modules/rewards/dtos/ICreateRewardRequestDTO';
import RewardRequest from '../entities/RewardRequest';

class RewardRequestsRepository implements IRewardRequestsRepository {
  private ormRepository: Repository<RewardRequest>;

  constructor() {
    this.ormRepository = getRepository(RewardRequest);
  }

  public async findById(id: string): Promise<RewardRequest | undefined> {
    const rewardRequest = await this.ormRepository.findOne(id);

    return rewardRequest;
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<RewardRequest[]> {
    const reward_requests = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return reward_requests;
  }

  public async create(
    reward_request_data: ICreateRewardRequestDTO,
  ): Promise<RewardRequest> {
    const reward_request = this.ormRepository.create(reward_request_data);

    await this.ormRepository.save(reward_request);

    return reward_request;
  }

  public async save(reward_request: RewardRequest): Promise<RewardRequest> {
    return this.ormRepository.save(reward_request);
  }

  public async remove(reward_request: RewardRequest): Promise<void> {
    await this.ormRepository.remove(reward_request);
  }
}

export default RewardRequestsRepository;
