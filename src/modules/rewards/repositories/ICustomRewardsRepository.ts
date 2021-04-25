import CustomReward from '../infra/typeorm/entities/CustomReward';
import ICreateCustomRewardDTO from '../dtos/ICreateCustomRewardDTO';
import IFindCustomRewardByTitleDTO from '../dtos/IFindCustomRewardByTitleDTO';

export default interface ICustomRewardsRepository {
  findAllFromAccount(account_id: string): Promise<CustomReward[]>;
  findById(id: string): Promise<CustomReward | undefined>;
  findByTitle(
    data: IFindCustomRewardByTitleDTO,
  ): Promise<CustomReward | undefined>;
  create(data: ICreateCustomRewardDTO): Promise<CustomReward>;
  save(custom_reward: CustomReward): Promise<CustomReward>;
  remove(custom_reward: CustomReward): Promise<void>;
}
