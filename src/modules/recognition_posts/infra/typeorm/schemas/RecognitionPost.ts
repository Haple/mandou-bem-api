import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('recognition_posts')
class RecognitionPost {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('uuid')
  account_id: string;

  @Column('uuid')
  from_user_id: string;

  @Column('uuid')
  to_user_id: string;

  @Column()
  from_name: string;

  @Column()
  to_name: string;

  @Column()
  from_avatar: string;

  @Column()
  to_avatar: string;

  @Column()
  content: string;

  @Column()
  recognition_points: number;

  @Column()
  comments: {
    user_id: string;
    user_name: string;
    content: string;
  }[] = [];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RecognitionPost;
