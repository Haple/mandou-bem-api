import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { startOfMonth } from 'date-fns';
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<IRemainingPointsToSendDTO> {
    const cached_remaining_points = await this.cacheProvider.recover<
      IRemainingPointsToSendDTO
    >(`remaining_points:${user_id}`);

    if (cached_remaining_points) {
      return cached_remaining_points;
    }

    const recognition_posts = await this.recognitionPostsRepository.findAllFromUser(
      {
        from_user_id: user_id,
        since_date: startOfMonth(Date.now()),
      },
    );

    const allowed_points_each_month = 100;

    const remaining_points =
      allowed_points_each_month -
      recognition_posts.reduce(
        (sum, recognition_post) => sum + recognition_post.recognition_points,
        0,
      );

    await this.cacheProvider.save(`remaining_points:${user_id}`, {
      remaining_points,
    });

    return {
      remaining_points,
    };
  }
}

export default RemainingPointsToSendService;
