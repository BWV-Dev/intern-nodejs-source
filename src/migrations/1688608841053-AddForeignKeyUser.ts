import {MigrationInterface, QueryRunner, TableForeignKey} from 'typeorm';

export class AddForeignKeyUser1688608841053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const foreignKey = new TableForeignKey({
        columnNames: ["group_id"],
        name: "FK_UserGroup",
        referencedColumnNames: ["id"],
        referencedTableName: "group",
        onDelete: "CASCADE"
    });
    await queryRunner.createForeignKey("user", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP FOREIGN KEY "FK_UserGroup";`,
    );
  }
}
