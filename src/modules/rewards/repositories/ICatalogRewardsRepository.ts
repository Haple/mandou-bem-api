import CatalogReward from '../infra/typeorm/entities/CatalogReward';
import ICreateCatalogRewardDTO from '../dtos/ICreateCatalogRewardDTO';
import IFindCatalogRewardByTitleDTO from '../dtos/IFindCatalogRewardByTitleDTO';

export default interface ICatalogRewardsRepository {
  findAllFromAccount(account_id: string): Promise<CatalogReward[]>;
  findById(id: string): Promise<CatalogReward | undefined>;
  findByTitle(
    data: IFindCatalogRewardByTitleDTO,
  ): Promise<CatalogReward | undefined>;
  create(data: ICreateCatalogRewardDTO): Promise<CatalogReward>;
  save(catalog_reward: CatalogReward): Promise<CatalogReward>;
  remove(catalog_reward: CatalogReward): Promise<void>;
}
