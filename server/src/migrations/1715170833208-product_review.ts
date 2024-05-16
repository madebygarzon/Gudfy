import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductReview1715170833208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "product_review" (
            "id" SERIAL PRIMARY KEY,
            "product_store_variant_id" VARCHAR(255),
            "customer_id" VARCHAR(255) NOT NULL,
            "customer_name" VARCHAR(255) NOT NULL,
            "display_name" VARCHAR(255) NOT NULL,
            "rating" INTEGER NOT NULL,
            "content" VARCHAR(255) NOT NULL,
            "approved" BOOLEAN NOT NULL,
            CONSTRAINT "FK_product_review_product_store_variant_id" FOREIGN KEY ("product_store_variant_id") REFERENCES "store_x_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "FK_product_review_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS "product_review"
        `);
  }
}
