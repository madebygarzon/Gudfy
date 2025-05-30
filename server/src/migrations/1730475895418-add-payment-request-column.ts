import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPaymentRequestColumn1730475895418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add payment_request column to store table with default value false
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "payment_request",
        type: "boolean",
        default: false,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the column
    await queryRunner.dropColumn("store", "payment_request");
  }
}
