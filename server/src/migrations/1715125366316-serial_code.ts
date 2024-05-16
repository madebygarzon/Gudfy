import { MigrationInterface, QueryRunner } from "typeorm";

export class SerialCode1715125366316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "serial_code" (
      "id" character varying NOT NULL,
      "serial" character varying NOT NULL,
      "store_variant_id" character varying,
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      CONSTRAINT "PK_serial_code" PRIMARY KEY ("id"),
      CONSTRAINT "FK_serial_code_store_variant_id" FOREIGN KEY ("store_variant_id") REFERENCES "store_x_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "serial_code"
      `);
  }
}
