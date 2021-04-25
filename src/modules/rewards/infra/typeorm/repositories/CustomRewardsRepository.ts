import { getRepository, Repository } from 'typeorm';

import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import ICreateCustomRewardDTO from '@modules/rewards/dtos/ICreateCustomRewardDTO';
import IFindCustomRewardByTitleDTO from '@modules/rewards/dtos/IFindCustomRewardByTitleDTO';
import CustomReward from '../entities/CustomReward';

class CustomRewardsRepository implements ICustomRewardsRepository {
  private ormRepository: Repository<CustomReward>;

  constructor() {
    this.ormRepository = getRepository(CustomReward);
  }

  public async findByTitle({
    account_id,
    title,
  }: IFindCustomRewardByTitleDTO): Promise<CustomReward | undefined> {
    const custom_reward = await this.ormRepository.findOne({
      where: {
        account_id,
        title,
      },
    });
    return custom_reward;
  }

  public async findById(id: string): Promise<CustomReward | undefined> {
    const customReward = await this.ormRepository.findOne(id);

    return customReward;
  }

  public async findAllFromAccount(account_id: string): Promise<CustomReward[]> {
    const custom_rewards = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return custom_rewards;
  }

  public async create(
    custom_reward_data: ICreateCustomRewardDTO,
  ): Promise<CustomReward> {
    const custom_reward = this.ormRepository.create(custom_reward_data);

    await this.ormRepository.save(custom_reward);

    return custom_reward;
  }

  public async save(custom_reward: CustomReward): Promise<CustomReward> {
    return this.ormRepository.save(custom_reward);
  }

  public async remove(custom_reward: CustomReward): Promise<void> {
    await this.ormRepository.softRemove(custom_reward);
  }
}

export default CustomRewardsRepository;
