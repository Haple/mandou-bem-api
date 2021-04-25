import { uuid } from 'uuidv4';

import ICreateCustomRewardDTO from '@modules/rewards/dtos/ICreateCustomRewardDTO';
import IFindCustomRewardByTitleDTO from '@modules/rewards/dtos/IFindCustomRewardByTitleDTO';
import CustomReward from '../../infra/typeorm/entities/CustomReward';
import ICustomRewardsRepository from '../ICustomRewardsRepository';

class FakeCustomRewardsRepository implements ICustomRewardsRepository {
  private custom_rewards: CustomReward[] = [];

  public async findById(id: string): Promise<CustomReward | undefined> {
    const custom_reward = this.custom_rewards.find(c => c.id === id);

    return custom_reward;
  }

  public async findByTitle({
    account_id,
    title,
  }: IFindCustomRewardByTitleDTO): Promise<CustomReward | undefined> {
    return this.custom_rewards.filter(
      custom_reward =>
        custom_reward.account_id === account_id &&
        custom_reward.title === title,
    )[0];
  }

  public async findAllFromAccount(account_id: string): Promise<CustomReward[]> {
    return this.custom_rewards.filter(
      custom_reward => custom_reward.account_id === account_id,
    );
  }

  public async create(
    custom_reward_data: ICreateCustomRewardDTO,
  ): Promise<CustomReward> {
    const custom_reward = new CustomReward();

    Object.assign(custom_reward, { id: uuid() }, custom_reward_data);

    this.custom_rewards.push(custom_reward);

    return custom_reward;
  }

  public async save(custom_reward: CustomReward): Promise<CustomReward> {
    const find_index = this.custom_rewards.findIndex(
      find_custom_reward => find_custom_reward.id === custom_reward.id,
    );

    this.custom_rewards[find_index] = custom_reward;

    return custom_reward;
  }

  public async remove(custom_reward: CustomReward): Promise<void> {
    this.custom_rewards.splice(
      this.custom_rewards.indexOf(custom_reward),
      1,
    );
  }
}

export default FakeCustomRewardsRepository;
