import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { isAfter } from 'date-fns';
import { Expose } from 'class-transformer';
import Account from '@modules/users/infra/typeorm/entities/Account';
import Position from '@modules/users/infra/typeorm/entities/Position';
import Department from '@modules/users/infra/typeorm/entities/Department';

@Entity('enps_surveys')
class EnpsSurvey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @Column()
  position_id: string;

  @Column()
  department_id: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column()
  question: string;

  @Column()
  end_date: Date;

  @Column()
  promoters: number;

  @Column()
  passives: number;

  @Column()
  detractors: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  ended_at: Date;

  @Expose({ name: 'enps_score' })
  getEnpScore(): number {
    const enps_score =
      ((this.promoters - this.detractors) / this.getTotaResponses()) * 100;
    return Math.trunc(enps_score);
  }

  @Expose({ name: 'total_responses' })
  getTotaResponses(): number {
    return this.promoters + this.passives + this.detractors;
  }

  @Expose({ name: 'ended' })
  isEnded(): boolean {
    if (isAfter(new Date(), this.end_date) || this.ended_at) {
      return true;
    }
    return false;
  }
}

export default EnpsSurvey;
