import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { differenceInSeconds, lastDayOfMonth, startOfMonth } from 'date-fns';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IRemainingPointsToSendDTO from '../dtos/IRemainingPointsToSendDTO';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class RemainingPointsToSendService {
  constructor(
    @inject('RecognitionPostsRepository')
    private recognitionPostsRepository: IRecognitionPostsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<IRemainingPointsToSendDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const cached_remaining_points = await this.cacheProvider.recover<
      IRemainingPointsToSendDTO
    >(`remaining_points:${user.account_id}:${user_id}`);

    if (cached_remaining_points) {
      return cached_remaining_points;
    }

    const recognition_posts = await this.recognitionPostsRepository.findAllFromUser(
      {
        from_user_id: user_id,
        since_date: startOfMonth(Date.now()),
      },
    );

    const allowed_points_each_month = user.position.points || 100;

    const remaining_points =
      allowed_points_each_month -
      recognition_posts.reduce(
        (sum, recognition_post) => sum + recognition_post.recognition_points,
        0,
      );

    await this.cacheProvider.save(
      `remaining_points:${user.account_id}:${user_id}`,
      {
        remaining_points,
      },
      differenceInSeconds(lastDayOfMonth(new Date()), new Date()) +
        60 * 60 * 24,
    );

    return {
      remaining_points,
    };
  }
}

export default RemainingPointsToSendService;
