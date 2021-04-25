import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

import ProviderAccount from '@modules/provider_accounts/infra/typeorm/entities/ProviderAccount';

@Entity('gift_cards')
class GiftCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => ProviderAccount, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderAccount;

  @Column()
  title: string;

  @Column()
  image_url: string;

  @Column()
  points: number;

  @Column()
  units_available: number;

  @Column()
  expiration_days: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export default GiftCard;
