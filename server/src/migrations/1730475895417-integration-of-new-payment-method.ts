import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class IntegrationOfNewPaymentMethod1730475895417 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add proof_of_payment column to store_order table
    await queryRunner.addColumn(
      "store_order",
      new TableColumn({
        name: "proof_of_payment",
        type: "character varying",
        isNullable: true,
      })
    );

    // Add new payment method
    await queryRunner.query(`INSERT INTO "pay_method" ("id", "method") VALUES
      ('Method_Manual_Pay_ID', 'Manual pay the Binance')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the payment method
    await queryRunner.query(`DELETE FROM "pay_method" WHERE "id" = 'Method_Manual_Pay_ID'`);
    
    // Drop the column
    await queryRunner.dropColumn("store_order", "proof_of_payment");
  }
}
