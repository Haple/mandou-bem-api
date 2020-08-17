import ICreateRecognitionPostDTO from '@modules/recognition_posts/dtos/ICreateRecognitionPostDTO';
import IFindAllFromUserDTO from '@modules/recognition_posts/dtos/IFindAllFromUserDTO';
import { isAfter } from 'date-fns';
import { ObjectID } from 'mongodb';
import IRankingItemDTO from '@modules/recognition_posts/dtos/IRankingItemDTO';
import RecognitionPost from '../../infra/typeorm/schemas/RecognitionPost';
import IRecognitionPostsRepository from '../IRecognitionPostsRepository';

class FakeRecognitionPostsRepository implements IRecognitionPostsRepository {
  private recognition_posts: RecognitionPost[] = [];

  public async rankByReceivedRecognitionPoints(
    account_id: string,
  ): Promise<IRankingItemDTO[]> {
    const posts = this.recognition_posts.filter(
      r => r.account_id === account_id,
    );

    const rankingMap = new Map<string, IRankingItemDTO>();

    posts.forEach(post => {
      const item = rankingMap.get(post.to_user_id);
      if (item) {
        item.recognition_points += post.recognition_points;
      } else {
        rankingMap.set(post.to_user_id, {
          to_name: post.to_name,
          to_avatar: post.to_avatar,
          recognition_points: post.recognition_points,
        });
      }
    });

    return Array.from(rankingMap.values());
  }

  public async findById(
    recognition_post_id: string,
  ): Promise<RecognitionPost | undefined> {
    return this.recognition_posts.filter(
      recognition_post =>
        recognition_post.id.toString() === recognition_post_id,
    )[0];
  }

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
      { id: new ObjectID(), created_at: Date.now(), comments: [] },
      recognition_post_data,
    );

    this.recognition_posts.push(recognition_post);

    return recognition_post;
  }

  public async save(
    recognition_post: RecognitionPost,
  ): Promise<RecognitionPost> {
    const findIndex = this.recognition_posts.findIndex(
      r => r.id === recognition_post.id,
    );

    this.recognition_posts[findIndex] = recognition_post;

    return recognition_post;
  }
}

export default FakeRecognitionPostsRepository;
