import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  custom_reward_request_id: string;
  account_id: string;
  reprove_reason: string;
}

@injectable()
class ReproveCustomRewardService {
  constructor(
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
    @inject('CustomRewardsRepository')
    private customRewardsRepository: ICustomRewardsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    custom_reward_request_id,
    account_id,
    reprove_reason,
  }: IRequest): Promise<CustomRewardRequest> {
    const reward_request = await this.customRewardRequestsRepository.findById(
      custom_reward_request_id,
    );

    if (!reward_request || reward_request.account_id !== account_id) {
      throw new AppError('Custom reward request not found.');
    }

    if (reward_request.status !== 'pending_approval') {
      throw new AppError('Unable to reprove custom reward request.');
    }

    reward_request.user.recognition_points +=
      reward_request.custom_reward.points;
    this.usersRepository.save(reward_request.user);

    reward_request.custom_reward.units_available += 1;
    this.customRewardsRepository.save(reward_request.custom_reward);

    const reward_request_updated = await this.customRewardRequestsRepository.save(
      {
        ...reward_request,
        status: 'reproved',
        reprove_reason,
      },
    );

    return reward_request_updated;
  }
}

export default ReproveCustomRewardService;
