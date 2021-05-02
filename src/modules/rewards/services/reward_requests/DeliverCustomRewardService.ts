import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  reward_request_id: string;
  account_id: string;
}

@injectable()
class DeliverRewardService {
  constructor(
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
  ) {}

  public async execute({
    reward_request_id,
    account_id,
  }: IRequest): Promise<CustomRewardRequest> {
    const reward_request = await this.customRewardRequestsRepository.findById(
      reward_request_id,
    );

    if (!reward_request || reward_request.account_id !== account_id) {
      throw new AppError('Reward request not found.');
    }

    if (reward_request.status === 'DELIVERED') {
      throw new AppError('Reward request was already delivered.');
    }

    const reward_request_updated = await this.customRewardRequestsRepository.save(
      {
        ...reward_request,
        status: 'DELIVERED',
      },
    );

    return reward_request_updated;
  }
}

export default DeliverRewardService;
