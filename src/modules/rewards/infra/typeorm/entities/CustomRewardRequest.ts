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
import Account from '@modules/users/infra/typeorm/entities/Account';
import CustomReward from './CustomReward';

@Entity('custom_reward_requests')
class CustomRewardRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  custom_reward_id: string;

  @ManyToOne(() => CustomReward, { eager: true })
  @JoinColumn({ name: 'custom_reward_id' })
  custom_reward: CustomReward;

  @Column()
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';

  @Column()
  reprove_reason: string;

  @Column()
  expire_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CustomRewardRequest;
