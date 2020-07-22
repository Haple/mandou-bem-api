import ICreateRecognitionPostDTO from '../dtos/ICreateRecognitionPostDTO';
import RecognitionPost from '../infra/typeorm/schemas/RecognitionPost';

export default interface IRecognitionPostsRepository {
  create(recognition_post: ICreateRecognitionPostDTO): Promise<RecognitionPost>;
  findAllFromAccount(account_id: string): Promise<RecognitionPost[]>;
}
