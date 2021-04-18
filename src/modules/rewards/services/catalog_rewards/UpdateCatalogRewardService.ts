import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICatalogRewardsRepository from '../../repositories/ICatalogRewardsRepository';

import CatalogReward from '../../infra/typeorm/entities/CatalogReward';

interface IRequest {
  catalog_reward_id: string;
  title: string;
  image_url: string;
  points: number;
  account_id: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

@injectable()
class UpdateCatalogRewardService {
  constructor(
    @inject('CatalogRewardsRepository')
    private catalogRewardsRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({
    catalog_reward_id,
    title,
    image_url,
    points,
    account_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<CatalogReward> {
    const catalog_reward = await this.catalogRewardsRepository.findById(
      catalog_reward_id,
    );

    if (!catalog_reward || catalog_reward.account_id !== account_id) {
      throw new AppError('Catalog reward not found.');
    }

    const rewardWithSameTitle = await this.catalogRewardsRepository.findByTitle(
      {
        title,
        account_id,
      },
    );

    if (rewardWithSameTitle && rewardWithSameTitle.id !== catalog_reward_id) {
      throw new AppError('Reward title already used.');
    }

    return this.catalogRewardsRepository.save({
      ...catalog_reward,
      title,
      image_url,
      points,
      units_available,
      expiration_days,
      description,
    });
  }
}

export default UpdateCatalogRewardService;
