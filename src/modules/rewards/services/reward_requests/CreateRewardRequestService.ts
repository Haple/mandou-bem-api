import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import RewardRequest from '@modules/rewards/infra/typeorm/entities/RewardRequest';
import ICatalogRewardsRepository from '@modules/rewards/repositories/ICatalogRewardsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IRewardRequestsRepository from '../../repositories/IRewardRequestsRepository';

interface IRequest {
  catalog_reward_id: string;
  user_id: string;
  account_id: string;
}

@injectable()
class CreateRewardRequestService {
  constructor(
    @inject('RewardRequestsRepository')
    private rewardRequestsRepository: IRewardRequestsRepository,
    @inject('CatalogRewardsRepository')
    private catalogRewardsRepository: ICatalogRewardsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    catalog_reward_id,
    user_id,
    account_id,
  }: IRequest): Promise<RewardRequest> {
    const user = await this.usersRepository.findById(user_id);

    if (!user || user.account_id !== account_id) {
      throw new AppError('User not found.');
    }

    const catalog_reward = await this.catalogRewardsRepository.findById(
      catalog_reward_id,
    );

    if (!catalog_reward || catalog_reward.account_id !== account_id) {
      throw new AppError('Catalog reward not found.');
    }

    if (user.recognition_points < catalog_reward.points) {
      throw new AppError('Insufficient recognition points.');
    }

    const reward_request = await this.rewardRequestsRepository.create({
      catalog_reward_id,
      user_id,
      account_id,
    });

    user.recognition_points -= catalog_reward.points;

    this.usersRepository.save(user);

    return reward_request;
  }
}

export default CreateRewardRequestService;
