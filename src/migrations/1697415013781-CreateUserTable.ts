import { MigrationInterface, QueryRunner, Table } from 'typeorm';
export class User1697288547770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the table
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'tinyint',
          },
          {
            name: 'deleted',
            type: 'tinyint',
          },
          {
            name: 'last_login',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    const userList = [];

    for (let i = 1; i < 10000; i++) {
      userList.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password:
          '$2y$10$PyQOAjvb76vF.vsPiC9yCuE07vz6P/7jjsXCNKoAvmPv4XZ0PHJAu',
        role: `${Math.floor(Math.random() * 3) + 1}`,
        deleted: 0,
        lastLogin: new Date(),
        createdBy: 'Admin',
        updatedBy: 'Admin',
      });
    }

    // Create seed data
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values(userList)
      .execute();
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the table
    await queryRunner.dropTable('user');
  }
}
