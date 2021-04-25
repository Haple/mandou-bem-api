import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICustomRewardsRepository from '../../repositories/ICustomRewardsRepository';

import CustomReward from '../../infra/typeorm/entities/CustomReward';

interface IRequest {
  title: string;
  image_url: string;
  points: number;
  account_id: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

@injectable()
class CreateCustomRewardService {
  constructor(
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
  ) {}

  public async execute({
    title,
    image_url,
    points,
    account_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<CustomReward> {
    const rewardWithSameTitle = await this.customRewardsRepository.findByTitle({
      title,
      account_id,
    });

    if (rewardWithSameTitle) {
      throw new AppError('Reward title already used.');
    }

    const custom_reward = await this.customRewardsRepository.create({
      title,
      image_url,
      points,
      account_id,
      units_available,
      expiration_days,
      description,
    });

    return custom_reward;
  }
}

export default CreateCustomRewardService;
