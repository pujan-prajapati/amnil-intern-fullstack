import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersMigration1738244320820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "auth" ADD COLUMN "image" TEXT
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auth" DROP COLUMN "image"
    `);
  }
}
