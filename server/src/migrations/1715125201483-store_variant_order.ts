import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreVariantOrder1715125201483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "store_variant_order" (
          "id" character varying NOT NULL,
          "store_variant_id" character varying NOT NULL,
          "store_order_id" character varying,
          "amount" integer NOT NULL,
          "total_price" numeric,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_store_variant_order" PRIMARY KEY ("id"),
          CONSTRAINT "FK_store_variant_order_store_variant_id" FOREIGN KEY ("store_variant_id") REFERENCES "store_x_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_store_variant_order_store_order_id" FOREIGN KEY ("store_order_id") REFERENCES "store_order"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "store_variant_order"
      `);
  }
}
