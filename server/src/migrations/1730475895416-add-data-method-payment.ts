import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class AddDataMethodPayment1730475895416 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "data_method_payment" (
          "id" character varying NOT NULL,
          "order_id" character varying NOT NULL,
          "coinpal" character varying,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("data_method_payment", ["id"]);

    await queryRunner.createForeignKey(
      "data_method_payment",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_order",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const foreignKey = await queryRunner
      .getTable("data_method_payment")
      .then((table) =>
        table.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("order_id") !== -1
        )
      );
    if (foreignKey) {
      await queryRunner.dropForeignKey("data_method_payment", foreignKey);
    }

    await queryRunner.dropTable("data_method_payment", true);
  }
}
