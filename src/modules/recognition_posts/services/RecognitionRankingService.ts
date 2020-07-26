import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IRecognitionPostsRepository from '../repositories/IRecognitionPostsRepository';
import IRankingItemDTO from '../dtos/IRankingItemDTO';

interface IRequest {
  account_id: string;
}

@injectable()
class RecognitionRankingService {
  constructor(
    @inject('RecognitionPostsRepository')
    private recognitionPostsRepository: IRecognitionPostsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ account_id }: IRequest): Promise<IRankingItemDTO[]> {
    const cached_ranking = await this.cacheProvider.recover<IRankingItemDTO[]>(
      `recognition_ranking:${account_id}`,
    );

    if (cached_ranking) {
      return cached_ranking;
    }

    const ranking = await this.recognitionPostsRepository.rankByReceivedRecognitionPoints(
      account_id,
    );

    await this.cacheProvider.save(`recognition_ranking:${account_id}`, ranking);

    return ranking;
  }
}

export default RecognitionRankingService;
