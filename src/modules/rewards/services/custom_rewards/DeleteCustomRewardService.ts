import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICustomRewardsRepository from '../../repositories/ICustomRewardsRepository';

interface IRequest {
  account_id: string;
  custom_reward_id: string;
}

@injectable()
class DeleteCustomRewardService {
  constructor(
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
  ) {}

  public async execute({
    account_id,
    custom_reward_id,
  }: IRequest): Promise<void> {
    const custom_reward = await this.customRewardsRepository.findById(
      custom_reward_id,
    );

    if (custom_reward && custom_reward.account_id === account_id) {
      await this.customRewardsRepository.remove(custom_reward);
      return;
    }

    throw new AppError('Custom reward not found.', 404);
  }
}

export default DeleteCustomRewardService;
