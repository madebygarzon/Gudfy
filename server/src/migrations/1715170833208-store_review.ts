import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductReview1715170833208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "store_review" (
            "id" VARCHAR(255)  NOT NULL,
            "store_order_id" VARCHAR(255)  NOT NULL,
            "store_id" VARCHAR(255)  NOT NULL,
            "customer_id" VARCHAR(255) NOT NULL,
            "customer_name" VARCHAR(255) NOT NULL,
            "rating" INTEGER NOT NULL,
            "content" VARCHAR(255) NOT NULL,
            "approved" BOOLEAN NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_store_review_order" PRIMARY KEY ("id"),
            CONSTRAINT "FK_store_review_order_id" FOREIGN KEY ("store_order_id") REFERENCES "store_order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "FK_store_review_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "FK_store_review_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS "store_review"
        `);
  }
}
