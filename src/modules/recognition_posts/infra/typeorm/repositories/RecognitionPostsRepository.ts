import { getMongoRepository, MongoRepository } from 'typeorm';

import IRecognitionPostsRepository from '@modules/recognition_posts/repositories/IRecognitionPostsRepository';
import ICreateRecognitionPostDTO from '@modules/recognition_posts/dtos/ICreateRecognitionPostDTO';
import IFindAllFromUserDTO from '@modules/recognition_posts/dtos/IFindAllFromUserDTO';
import IRankingItemDTO from '@modules/recognition_posts/dtos/IRankingItemDTO';
import RecognitionPost from '../schemas/RecognitionPost';

class RecognitionPostsRepository implements IRecognitionPostsRepository {
  private ormRepository: MongoRepository<RecognitionPost>;

  constructor() {
    this.ormRepository = getMongoRepository(RecognitionPost, 'mongo');
  }

  public async rankByReceivedRecognitionPoints(
    account_id: string,
  ): Promise<IRankingItemDTO[]> {
    const ranking = await this.ormRepository
      .aggregate<IRankingItemDTO>([
        {
          $match: {
            account_id,
          },
        },
        {
          $group: {
            _id: {
              to_user_id: '$to_user_id',
            },
            to_name: { $first: '$to_name' },
            to_avatar: { $last: '$to_avatar' },
            recognition_points: { $sum: '$recognition_points' },
          },
        },
        {
          $sort: {
            recognition_points: -1,
          },
        },
      ])
      .toArray();
    return ranking;
  }

  public async findById(
    recognition_post_id: string,
  ): Promise<RecognitionPost | undefined> {
    return this.ormRepository.findOne(recognition_post_id);
  }

  public async findAllFromAccount(
    account_id: string,
  ): Promise<RecognitionPost[]> {
    return this.ormRepository.find({
      where: {
        account_id,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  public async findAllFromUser({
    from_user_id,
    since_date,
  }: IFindAllFromUserDTO): Promise<RecognitionPost[]> {
    return this.ormRepository.find({
      where: {
        from_user_id,
        created_at: { $gte: since_date },
      },
    });
  }

  public async create(
    recognition_post_data: ICreateRecognitionPostDTO,
  ): Promise<RecognitionPost> {
    const recognition_post = this.ormRepository.create(recognition_post_data);

    await this.ormRepository.save(recognition_post);

    return recognition_post;
  }

  public async save(
    recognition_post: RecognitionPost,
  ): Promise<RecognitionPost> {
    return this.ormRepository.save(recognition_post);
  }
}

export default RecognitionPostsRepository;
