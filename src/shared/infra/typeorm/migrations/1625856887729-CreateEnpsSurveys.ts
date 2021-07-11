import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateEnpsSurveys1625856887729
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'enps_surveys',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'account_id',
            type: 'uuid',
          },
          {
            name: 'department_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'position_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'question',
            type: 'varchar',
          },
          {
            name: 'end_date',
            type: 'date',
          },
          {
            name: 'promoters',
            type: 'integer',
            default: 0,
          },
          {
            name: 'passives',
            type: 'integer',
            default: 0,
          },
          {
            name: 'detractors',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'ended_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_EnpsSurveys_Accounts',
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_EnpsSurveys_Departments',
            columnNames: ['department_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'departments',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_EnpsSurveys_Positions',
            columnNames: ['position_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'positions',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('enps_surveys');
  }
}
