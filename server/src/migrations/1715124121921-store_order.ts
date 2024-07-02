import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreOrder1715124121921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "store_order" (
      "id" character varying NOT NULL,
      "customer_id" character varying NOT NULL,
      "pay_method_id" character varying NOT NULL,
      "order_status_id" character varying NOT NULL,
      "SellerApproved" boolean NOT NULL,
      "CustomerApproved" boolean NOT NULL,
      "quantity_products" integer NOT NULL,
      "total_price" numeric NOT NULL,
      "name" character varying NOT NULL,
      "last_name" character varying NOT NULL ,
      "email" character varying NOT NULL,
      "conty" character varying NOT NULL,
      "city" character varying NOT NULL,
      "phone" character varying NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      CONSTRAINT "PK_store_order" PRIMARY KEY ("id"),
      CONSTRAINT "FK_store_order_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "FK_store_order_pay_method_id" FOREIGN KEY ("pay_method_id") REFERENCES "pay_method"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "FK_store_order_order_status_id" FOREIGN KEY ("order_status_id") REFERENCES "order_status"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE IF EXISTS "store_order"
  `);
  }
}
