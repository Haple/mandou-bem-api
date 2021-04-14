import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCatalogRewards1595193130750
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'catalog_rewards',
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
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'image_url',
            type: 'varchar',
          },
          {
            name: 'points',
            type: 'integer',
            default: 0,
          },
          {
            name: 'units_available',
            type: 'integer',
            default: 0,
          },
          {
            name: 'description',
            type: 'varchar',
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
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_CatalogRewards_Accounts',
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('catalog_rewards');
  }
}
