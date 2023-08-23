import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColumnUsername1688365066667 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'username',
                type: 'varchar',
                length: '225',
                isUnique: true,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP COLUMN "username"`,
        )
    }

}
