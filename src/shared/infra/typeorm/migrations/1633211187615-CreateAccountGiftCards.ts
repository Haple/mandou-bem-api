import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAccountGiftCards1633211187615
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_gift_cards',
        columns: [
          {
            name: 'gift_card_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'account_id',
            type: 'uuid',
            isPrimary: true,
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
        ],
        foreignKeys: [
          {
            name: 'FK_AccountGiftCards_GiftCards',
            columnNames: ['gift_card_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'gift_cards',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_AccountGiftCards_Accounts',
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_gift_cards');
  }
}
