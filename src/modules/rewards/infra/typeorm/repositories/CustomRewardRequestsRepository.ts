import { getRepository, Repository } from 'typeorm';

import ICustomRewardRequestsRepository from '@modules/rewards/repositories/ICustomRewardRequestsRepository';
import ICreateCustomRewardRequestDTO from '@modules/rewards/dtos/ICreateCustomRewardRequestDTO';
import CustomRewardRequest from '../entities/CustomRewardRequest';

class CustomRewardRequestsRepository
  implements ICustomRewardRequestsRepository {
  private ormRepository: Repository<CustomRewardRequest>;

  constructor() {
    this.ormRepository = getRepository(CustomRewardRequest);
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
