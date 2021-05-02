import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  custom_reward_id: string;
  user_id: string;
  account_id: string;
}

interface IResponse {
  id: string;
  status: string;
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
  }: IRequest): Promise<IResponse> {
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

    if (custom_reward.units_available <= 0) {
      throw new AppError('No units available.');
    }

    const custom_reward_request = await this.customRewardRequestsRepository.create(
      {
        custom_reward_id,
        user_id,
        account_id,
        status: 'pending_approval',
      },
    );

    user.recognition_points -= custom_reward.points;
    this.usersRepository.save(user);

    custom_reward.units_available -= 1;
    this.customRewardsRepository.save(custom_reward);

    return {
      id: custom_reward_request.id,
      status: custom_reward_request.status,
    };
  }
}

export default CreateCustomRewardRequestService;
