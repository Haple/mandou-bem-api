import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import EnpsSurvey from './EnpsSurvey';

@Entity('enps_answers')
class EnpsAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enps_survey_id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => EnpsSurvey, { eager: true })
  @JoinColumn({ name: 'enps_survey_id' })
  enps_survey: EnpsSurvey;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  answer: string;

  @Column()
  score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default EnpsAnswer;
