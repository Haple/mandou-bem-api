import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICatalogRewardsRepository from '../repositories/ICatalogRewardsRepository';

interface IRequest {
  account_id: string;
  catalog_reward_id: string;
}

@injectable()
class DeleteCatalogRewardService {
  constructor(
    @inject('CatalogRewardsRepository')
    private catalogRewardsRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({
    account_id,
    catalog_reward_id,
  }: IRequest): Promise<void> {
    const catalog_reward = await this.catalogRewardsRepository.findById(
      catalog_reward_id,
    );

    if (catalog_reward && catalog_reward.account_id === account_id) {
      await this.catalogRewardsRepository.remove(catalog_reward);
      return;
    }

    throw new AppError('Catalog reward not found.', 404);
  }
}

export default DeleteCatalogRewardService;
