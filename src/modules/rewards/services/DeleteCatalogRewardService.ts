import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICatalogRewardsRepository from '../repositories/ICatalogRewardsRepository';

interface IRequest {
  account_id: string;
  user_id: string;
}

@injectable()
class DeleteCatalogRewardService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({ account_id, user_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (user && user.account_id === account_id) {
      await this.usersRepository.remove(user);
      return;
    }

    throw new AppError('User not found.', 404);
  }
}

export default DeleteCatalogRewardService;
