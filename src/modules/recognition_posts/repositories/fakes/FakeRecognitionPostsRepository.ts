import { uuid } from 'uuidv4';

import ICreateRecognitionPostDTO from '@modules/recognition_posts/dtos/ICreateRecognitionPostDTO';
import IFindAllFromUserDTO from '@modules/recognition_posts/dtos/IFindAllFromUserDTO';
import { isAfter } from 'date-fns';
import RecognitionPost from '../../infra/typeorm/schemas/RecognitionPost';
import IRecognitionPostsRepository from '../IRecognitionPostsRepository';

class FakeRecognitionPostsRepository implements IRecognitionPostsRepository {
  private recognition_posts: RecognitionPost[] = [];

  public async findAllFromAccount(
    account_id: string,
  ): Promise<RecognitionPost[]> {
    return this.recognition_posts.filter(
      recognition_post => recognition_post.account_id === account_id,
    );
  }

  public async findAllFromUser({
    from_user_id,
    since_date,
  }: IFindAllFromUserDTO): Promise<RecognitionPost[]> {
    return this.recognition_posts.filter(
      recognition_post =>
        recognition_post.from_user_id === from_user_id &&
        isAfter(recognition_post.created_at, since_date),
    );
  }

  public async create(
    recognition_post_data: ICreateRecognitionPostDTO,
  ): Promise<RecognitionPost> {
    const recognition_post = new RecognitionPost();

    Object.assign(
      recognition_post,
      { id: uuid(), created_at: Date.now() },
      recognition_post_data,
    );

    this.recognition_posts.push(recognition_post);

    return recognition_post;
  }
}

export default FakeRecognitionPostsRepository;
