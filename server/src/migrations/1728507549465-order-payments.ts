import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class OrderPayments1728507549465 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "order_payments" (
          "id" character varying NOT NULL,
          "store_id" character varying,
          "amount_paid" decimal(10,2) NOT NULL,
          "payment_note" varchar,
          "voucher" varchar,
          "customer_name" character varying,
          "commission" decimal(10,2) NOT NULL,
          "subtotal" decimal(10,2) NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("order_payments", ["id"]);

    await queryRunner.createForeignKey(
      "order_payments",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const foreignKey = await queryRunner
      .getTable("order_payments")
      .then((table) =>
        table.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("store_id") !== -1
        )
      );
    if (foreignKey) {
      await queryRunner.dropForeignKey("order_payments", foreignKey);
    }

    await queryRunner.dropTable("order_payments", true);
  }
}
