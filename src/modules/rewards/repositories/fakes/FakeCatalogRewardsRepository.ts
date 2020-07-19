import { uuid } from 'uuidv4';

import ICreateCatalogRewardDTO from '@modules/rewards/dtos/ICreateCatalogRewardDTO';
import IFindCatalogRewardByTitleDTO from '@modules/rewards/dtos/IFindCatalogRewardByTitleDTO';
import CatalogReward from '../../infra/typeorm/entities/CatalogReward';
import ICatalogRewardsRepository from '../ICatalogRewardsRepository';

class FakeCatalogRewardsRepository implements ICatalogRewardsRepository {
  private catalog_rewards: CatalogReward[] = [];

  public async findById(id: string): Promise<CatalogReward | undefined> {
    const catalog_reward = this.catalog_rewards.find(c => c.id === id);

    return catalog_reward;
  }

  public async findByTitle({
    account_id,
    title,
  }: IFindCatalogRewardByTitleDTO): Promise<CatalogReward | undefined> {
    return this.catalog_rewards.filter(
      catalog_reward =>
        catalog_reward.account_id === account_id &&
        catalog_reward.title === title,
    )[0];
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<CatalogReward[]> {
    return this.catalog_rewards.filter(
      catalog_reward => catalog_reward.account_id === account_id,
    );
  }

  public async create(
    catalog_reward_data: ICreateCatalogRewardDTO,
  ): Promise<CatalogReward> {
    const catalog_reward = new CatalogReward();

    Object.assign(catalog_reward, { id: uuid() }, catalog_reward_data);

    this.catalog_rewards.push(catalog_reward);

    return catalog_reward;
  }

  public async save(catalog_reward: CatalogReward): Promise<CatalogReward> {
    const find_index = this.catalog_rewards.findIndex(
      find_catalog_reward => find_catalog_reward.id === catalog_reward.id,
    );

    this.catalog_rewards[find_index] = catalog_reward;

    return catalog_reward;
  }

  public async remove(catalog_reward: CatalogReward): Promise<void> {
    this.catalog_rewards.splice(
      this.catalog_rewards.indexOf(catalog_reward),
      1,
    );
  }
}

export default FakeCatalogRewardsRepository;
