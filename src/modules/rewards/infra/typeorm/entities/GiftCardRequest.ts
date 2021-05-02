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
import GiftCard from './GiftCard';

@Entity('gift_card_requests')
class GiftCardRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  gift_card_id: string;

  @ManyToOne(() => GiftCard, { eager: true })
  @JoinColumn({ name: 'gift_card_id' })
  gift_card: GiftCard;

  @Column()
  status: 'use_available' | 'used';

  @Column()
  expire_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default GiftCardRequest;
