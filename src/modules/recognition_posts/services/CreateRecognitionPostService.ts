import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';
import RemainingPointsToSendService from './RemainingPointsToSendService';

interface IRequest {
  from_user_id: string;
  to_user_id: string;
  recognition_points: number;
  content: string;
}

@injectable()
class CreateRecognitionPostService {
  constructor(
    @inject('RemainingPointsToSendService')
    private remainingPointsToSendService: RemainingPointsToSendService,

    @inject('RecognitionPostsRepository')
    private recognitionPostsRepository: IRecognitionPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    from_user_id,
    to_user_id,
    recognition_points,
    content,
  }: IRequest): Promise<RecognitionPost> {
    if (from_user_id === to_user_id) {
      throw new AppError(`You could not recognize yourself. Nice try.`);
    }

    const from_user = await this.usersRepository.findById(from_user_id);
    const to_user = await this.usersRepository.findById(to_user_id);

    if (!from_user) {
      throw new AppError(`User not found: ${from_user_id}`, 404);
    }
    if (!to_user || to_user.account_id !== from_user.account_id) {
      throw new AppError(`User not found: ${to_user_id}`, 404);
    }

    const {
      remaining_points,
    } = await this.remainingPointsToSendService.execute({
      user_id: from_user_id,
    });

    if (recognition_points > remaining_points) {
      throw new AppError(`Insufficient remaining points`);
    }

    const recognition_post = await this.recognitionPostsRepository.create({
      account_id: from_user.account_id,
      from_user_id: from_user.id,
      to_user_id: to_user.id,
      from_name: from_user.name,
      to_name: to_user.name,
      from_avatar: from_user.avatar,
      to_avatar: to_user.avatar,
      content,
      recognition_points,
    });

    to_user.recognition_points += recognition_points;

    this.usersRepository.save(to_user);

    await this.cacheProvider.invalidate(
      `remaining_points:${from_user.account_id}:${from_user_id}`,
    );
    await this.cacheProvider.invalidatePrefix(
      `recognition_posts:${from_user.account_id}`,
    );
    await this.cacheProvider.invalidate(
      `recognition_ranking:${from_user.account_id}`,
    );

    return recognition_post;
  }
}

export default CreateRecognitionPostService;
