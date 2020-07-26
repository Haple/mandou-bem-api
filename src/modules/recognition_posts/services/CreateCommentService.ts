import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';

interface IRequest {
  user_id: string;
  recognition_post_id: string;
  content: string;
}

@injectable()
class CreateCommentService {
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
    recognition_post_id,
    content,
  }: IRequest): Promise<RecognitionPost> {
    const recognition_post = await this.recognitionPostsRepository.findById(
      recognition_post_id,
    );

    if (!recognition_post) {
      throw new AppError('Recognition post not found');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user || recognition_post.account_id !== user.account_id) {
      throw new AppError('User not found');
    }

    recognition_post.comments.push({
      user_id: user.id,
      user_name: user.getUsername(),
      content,
    });

    await this.recognitionPostsRepository.save(recognition_post);

    await this.cacheProvider.invalidate(`recognition_posts:${user.account_id}`);

    return recognition_post;
  }
}

export default CreateCommentService;
