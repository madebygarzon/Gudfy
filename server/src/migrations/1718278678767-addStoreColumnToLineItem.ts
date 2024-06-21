import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreColumnToLineItem1718278678767
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "line_item"
            ADD "store_variant_id" character varying;
        `);

    // Crear la llave foránea
    await queryRunner.query(`
            ALTER TABLE "line_item"
            ADD CONSTRAINT "FK_store_x_variant"
            FOREIGN KEY ("store_variant_id") REFERENCES "store_x_variant"("id")
            ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la restricción de llave foránea
    await queryRunner.query(`
            ALTER TABLE "line_item"
            DROP CONSTRAINT "FK_store_x_variant"
        `);

    // Eliminar la columna store_variant_id
    await queryRunner.query(`
            ALTER TABLE "line_item"
            DROP COLUMN "store_variant_id"
        `);
  }
}
