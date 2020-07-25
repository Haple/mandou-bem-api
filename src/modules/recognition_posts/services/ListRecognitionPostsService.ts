import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';

interface IRequest {
  account_id: string;
}

@injectable()
class ListRecognitionPostsService {
  constructor(
    @inject('RecognitionPostsRepository')
    private recognitionPostsRepository: IRecognitionPostsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ account_id }: IRequest): Promise<RecognitionPost[]> {
    const cached_posts = await this.cacheProvider.recover<RecognitionPost[]>(
      `recognition_posts:${account_id}`,
    );

    if (cached_posts) {
      return cached_posts;
    }

    const recognition_posts = await this.recognitionPostsRepository.findAllFromAccount(
      account_id,
    );

    await this.cacheProvider.save(
      `recognition_posts:${account_id}`,
      recognition_posts,
    );

    return recognition_posts;
  }
}

export default ListRecognitionPostsService;
