import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSerialCode1730475895413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "serial_code" 
      ADD COLUMN "store_variant_order_id" character varying,
      ADD CONSTRAINT "FK_serial_code_store_variant_order_id" 
      FOREIGN KEY ("store_variant_order_id") 
      REFERENCES "store_variant_order"("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "serial_code" 
      DROP CONSTRAINT "FK_serial_code_store_variant_order_id",
      DROP COLUMN "store_variant_order_id"
    `);
  }
}
