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
import CatalogReward from './CatalogReward';

@Entity('reward_requests')
class RewardRequest {
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
  catalog_reward_id: string;

  @ManyToOne(() => CatalogReward, { eager: true })
  @JoinColumn({ name: 'catalog_reward_id' })
  catalog_reward: CatalogReward;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RewardRequest;
