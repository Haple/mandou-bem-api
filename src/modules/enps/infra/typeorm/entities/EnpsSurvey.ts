import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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
}

export default EnpsSurvey;
