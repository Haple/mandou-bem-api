import ICreateRecognitionPostDTO from '../dtos/ICreateRecognitionPostDTO';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';
import IFindAllFromUserDTO from '../dtos/IFindAllFromUserDTO';
import IRankingItemDTO from '../dtos/IRankingItemDTO';

export default interface IRecognitionPostsRepository {
  create(recognition_post: ICreateRecognitionPostDTO): Promise<RecognitionPost>;
  findAllFromAccount(account_id: string): Promise<RecognitionPost[]>;
  findAllFromUser(data: IFindAllFromUserDTO): Promise<RecognitionPost[]>;
  findById(recognition_post_id: string): Promise<RecognitionPost | undefined>;
  save(recognition_post: RecognitionPost): Promise<RecognitionPost>;
  rankByReceivedRecognitionPoints(
    account_id: string,
  ): Promise<IRankingItemDTO[]>;
}
