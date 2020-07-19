import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICatalogRewardsRepository from '../repositories/ICatalogRewardsRepository';

import CatalogReward from '../infra/typeorm/entities/CatalogReward';

interface IRequest {
  title: string;
  image_url: string;
  points: number;
  account_id: string;
}

@injectable()
class CreateCatalogRewardService {
  constructor(
    @inject('CatalogRewardRepository')
    private catalogRewardRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({
    title,
    image_url,
    points,
    account_id,
  }: IRequest): Promise<CatalogReward> {
    const checkCatalogRewardExists = await this.catalogRewardRepository.findByTitle(
      {
        title,
        account_id,
      },
    );

    if (checkCatalogRewardExists) {
      throw new AppError('Reward title already used.');
    }

    const catalog_reward = await this.catalogRewardRepository.create({
      title,
      image_url,
      points,
      account_id,
    });

    return catalog_reward;
  }
}

export default CreateCatalogRewardService;
