import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateRecognitionPostDTO {
  account_id: string;
  from_user_id: string;
  from_name: string;
  from_avatar: string;
  to_user_id: string;
  to_name: string;
  to_avatar: string;
  content: string;
  recognition_points: number;
  from_user: User;
  to_user: User;
}
