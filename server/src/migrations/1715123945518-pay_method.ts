import { MigrationInterface, QueryRunner } from "typeorm";

export class PayMethod1715123945518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "pay_method" (
      "id" character varying NOT NULL,
      "method" character varying NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      CONSTRAINT "PK_pay_method" PRIMARY KEY ("id")
    )
  `);
    await queryRunner.query(`INSERT INTO "pay_method" ("id","method") VALUES
    ('Primary_Method_PAYPAL_ID','Paypal'),
    ('Secondary_Method_BINANCE_ID','Binance')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE IF EXISTS "pay_method"
  `);
  }
}
