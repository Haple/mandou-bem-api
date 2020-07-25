import { getMongoRepository, MongoRepository } from 'typeorm';

import IRecognitionPostsRepository from '@modules/recognition_posts/repositories/IRecognitionPostsRepository';
import ICreateRecognitionPostDTO from '@modules/recognition_posts/dtos/ICreateRecognitionPostDTO';
import IFindAllFromUserDTO from '@modules/recognition_posts/dtos/IFindAllFromUserDTO';
import RecognitionPost from '../schemas/RecognitionPost';

class RecognitionPostsRepository implements IRecognitionPostsRepository {
  private ormRepository: MongoRepository<RecognitionPost>;

  constructor() {
    this.ormRepository = getMongoRepository(RecognitionPost, 'mongo');
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
}

export default RecognitionPostsRepository;
