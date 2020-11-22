import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationDTO from '@modules/recognition_posts/dtos/IPaginationDTO';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';

interface IRequest {
  account_id: string;
  page: number;
  size: number;
}

@injectable()
class ListRecognitionPostsService {
  constructor(
    @inject('RecognitionPostsRepository')
    private recognitionPostsRepository: IRecognitionPostsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    account_id,
    page,
    size,
  }: IRequest): Promise<IPaginationDTO<RecognitionPost>> {
    const cacheKey = `recognition_posts:${account_id}:${page}_${size}`;

    const cached_posts = await this.cacheProvider.recover<
      IPaginationDTO<RecognitionPost>
    >(cacheKey);

    if (cached_posts) {
      return cached_posts;
    }

    const recognition_posts = await this.recognitionPostsRepository.findAllFromAccount(
      account_id,
      page,
      size,
    );

    await this.cacheProvider.save(cacheKey, recognition_posts);

    return recognition_posts;
  }
}

export default ListRecognitionPostsService;
