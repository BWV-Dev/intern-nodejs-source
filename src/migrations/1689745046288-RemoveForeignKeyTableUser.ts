import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveForeignKeyTableUser1689745046288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `user` DROP FOREIGN KEY FK_UserGroup',
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
