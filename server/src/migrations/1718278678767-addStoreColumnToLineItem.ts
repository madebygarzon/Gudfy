import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreColumnToLineItem1718278678767
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "line_item"
            ADD "store_id" character varying;
        `);

    // Crear la llave foránea
    await queryRunner.query(`
            ALTER TABLE "line_item"
            ADD CONSTRAINT "FK_store"
            FOREIGN KEY ("store_id") REFERENCES "store"("id")
            ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
