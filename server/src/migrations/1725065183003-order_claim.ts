import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class OrderDiscussion1725065183003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_claim" (
        "id" character varying NOT NULL,
        "store_variant_order_id" character varying,
        "customer_id" character varying,
        "status_order_claim_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      );
    `);

    await queryRunner.createForeignKey(
      "order_claim",
      new TableForeignKey({
        columnNames: ["store_variant_order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_variant_order",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "order_claim",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "order_claim",
      new TableForeignKey({
        columnNames: ["status_order_claim_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "status_order_claim",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("order_claim");

    const foreignKeys = table.foreignKeys.filter(
      (fk) =>
        fk.columnNames.indexOf("store_variant_order_id") !== -1 ||
        fk.columnNames.indexOf("customer_id") !== -1 ||
        fk.columnNames.indexOf("status_order_claim_id") !== -1
    );

    await queryRunner.dropForeignKeys("order_claim", foreignKeys);
    await queryRunner.dropTable("order_claim", true);
  }
}
