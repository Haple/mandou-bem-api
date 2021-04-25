import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  custom_reward_id: string;
  user_id: string;
  account_id: string;
}

@injectable()
class CreateCustomRewardRequestService {
  constructor(
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    custom_reward_id,
    user_id,
    account_id,
  }: IRequest): Promise<CustomRewardRequest> {
    const user = await this.usersRepository.findById(user_id);

    if (!user || user.account_id !== account_id) {
      throw new AppError('User not found.');
    }

    const custom_reward = await this.customRewardsRepository.findById(
      custom_reward_id,
    );

    if (!custom_reward || custom_reward.account_id !== account_id) {
      throw new AppError('Custom reward not found.');
    }

    if (user.recognition_points < custom_reward.points) {
      throw new AppError('Insufficient recognition points.');
    }

    const reward_request = await this.customRewardRequestsRepository.create({
      custom_reward_id,
      user_id,
      account_id,
      status: 'CREATED',
    });

    user.recognition_points -= custom_reward.points;

    this.usersRepository.save(user);

    return reward_request;
  }
}

export default CreateCustomRewardRequestService;
