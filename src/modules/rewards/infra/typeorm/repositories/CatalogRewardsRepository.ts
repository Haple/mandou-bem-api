import { getRepository, Repository } from 'typeorm';

import ICatalogRewardsRepository from '@modules/rewards/repositories/ICatalogRewardsRepository';
import ICreateCatalogRewardDTO from '@modules/rewards/dtos/ICreateCatalogRewardDTO';
import IFindCatalogRewardByTitleDTO from '@modules/rewards/dtos/IFindCatalogRewardByTitleDTO';
import CatalogReward from '../entities/CatalogReward';

class CatalogRewardsRepository implements ICatalogRewardsRepository {
  private ormRepository: Repository<CatalogReward>;

  constructor() {
    this.ormRepository = getRepository(CatalogReward);
  }

  public async findByTitle({
    account_id,
    title,
  }: IFindCatalogRewardByTitleDTO): Promise<CatalogReward | undefined> {
    const catalog_reward = await this.ormRepository.findOne({
      where: {
        account_id,
        title,
      },
    });
    return catalog_reward;
  }

  public async findById(id: string): Promise<CatalogReward | undefined> {
    const catalogReward = await this.ormRepository.findOne(id);

    return catalogReward;
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<CatalogReward[]> {
    const catalog_rewards = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return catalog_rewards;
  }

  public async create(
    catalog_reward_data: ICreateCatalogRewardDTO,
  ): Promise<CatalogReward> {
    const catalog_reward = this.ormRepository.create(catalog_reward_data);

    await this.ormRepository.save(catalog_reward);

    return catalog_reward;
  }

  public async save(catalog_reward: CatalogReward): Promise<CatalogReward> {
    return this.ormRepository.save(catalog_reward);
  }

  public async remove(catalog_reward: CatalogReward): Promise<void> {
    await this.ormRepository.remove(catalog_reward);
  }
}

export default CatalogRewardsRepository;
