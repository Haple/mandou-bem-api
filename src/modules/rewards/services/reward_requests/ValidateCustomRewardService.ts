import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  custom_reward_request_id: string;
  account_id: string;
}

@injectable()
class ValidateCustomRewardService {
  constructor(
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
  ) {}

  public async execute({
    custom_reward_request_id,
    account_id,
  }: IRequest): Promise<CustomRewardRequest> {
    const reward_request = await this.customRewardRequestsRepository.findById(
      custom_reward_request_id,
    );

    if (!reward_request || reward_request.account_id !== account_id) {
      throw new AppError('Custom reward request not found.');
    }

    if (reward_request.status !== 'use_available') {
      throw new AppError('Unable to validate custom reward.');
    }

    const reward_request_updated = await this.customRewardRequestsRepository.save(
      {
        ...reward_request,
        status: 'used',
      },
    );

    return reward_request_updated;
  }
}

export default ValidateCustomRewardService;
