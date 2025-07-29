import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";

export class ProductNotification1730475895422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product_notificate" (
          "id" character varying NOT NULL,
          "stock_notificate" integer NOT NULL,
          "activate" boolean NOT NULL DEFAULT false,
          "store_x_variant_id" character varying NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("product_notificate", ["id"]);

    await queryRunner.createForeignKey(
      "product_notificate",
      new TableForeignKey({
        columnNames: ["store_x_variant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_x_variant",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("product_notificate");
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("store_x_variant_id") !== -1
    );
    await queryRunner.dropForeignKey("product_notificate", foreignKey);

    await queryRunner.dropTable("product_notificate");
  }
}