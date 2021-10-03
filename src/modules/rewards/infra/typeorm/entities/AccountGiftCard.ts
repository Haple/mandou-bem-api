import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';
import GiftCard from './GiftCard';

@Entity('account_gift_cards')
class AccountGiftCard {
  @PrimaryColumn()
  account_id: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @PrimaryColumn()
  gift_card_id: string;

  @ManyToOne(() => GiftCard, { eager: true })
  @JoinColumn({ name: 'gift_card_id' })
  gift_card: GiftCard;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AccountGiftCard;
