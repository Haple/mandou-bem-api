import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICatalogRewardsRepository from '../../repositories/ICatalogRewardsRepository';

import CatalogReward from '../../infra/typeorm/entities/CatalogReward';

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
class CreateCatalogRewardService {
  constructor(
    @inject('CatalogRewardsRepository')
    private catalogRewardsRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({
    title,
    image_url,
    points,
    account_id,
    units_available,
    expiration_days,
    description,
  }: IRequest): Promise<CatalogReward> {
    const rewardWithSameTitle = await this.catalogRewardsRepository.findByTitle(
      {
        title,
        account_id,
      },
    );

    if (rewardWithSameTitle) {
      throw new AppError('Reward title already used.');
    }

    const catalog_reward = await this.catalogRewardsRepository.create({
      title,
      image_url,
      points,
      account_id,
      units_available,
      expiration_days,
      description,
    });

    return catalog_reward;
  }
}

export default CreateCatalogRewardService;
