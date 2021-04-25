import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICustomRewardsRepository from '../../repositories/ICustomRewardsRepository';

import CustomReward from '../../infra/typeorm/entities/CustomReward';

interface IRequest {
  custom_reward_id: string;
  title: string;
  image_url: string;
  points: number;
  account_id: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

@injectable()
class UpdateCustomRewardService {
  constructor(
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
  ) {}

  public async execute({
    custom_reward_id,
    title,
    image_url,
    points,
    account_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<CustomReward> {
    const custom_reward = await this.customRewardsRepository.findById(
      custom_reward_id,
    );

    if (!custom_reward || custom_reward.account_id !== account_id) {
      throw new AppError('Custom reward not found.');
    }

    const rewardWithSameTitle = await this.customRewardsRepository.findByTitle(
      {
        title,
        account_id,
      },
    );

    if (rewardWithSameTitle && rewardWithSameTitle.id !== custom_reward_id) {
      throw new AppError('Reward title already used.');
    }

    return this.customRewardsRepository.save({
      ...custom_reward,
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    });
  }
}

export default UpdateCustomRewardService;
