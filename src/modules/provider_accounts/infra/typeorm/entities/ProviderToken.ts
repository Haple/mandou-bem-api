import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ProviderAccount from './ProviderAccount';

@Entity('provider_tokens')
class ProviderToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => ProviderAccount, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider_account: ProviderAccount;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ProviderToken;
