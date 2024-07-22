import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class StoreXVariant1715088808355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "store_x_variant" (
          "id" character varying NOT NULL,
          "store_id" character varying NOT NULL,
          "variant_id" character varying NOT NULL,
          "price" float NOT NULL,
          "quantity_store" integer NOT NULL,
          "quantity_reserved" integer  NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`);
    await queryRunner.createPrimaryKey("store_x_variant", ["id"]);
    await queryRunner.createForeignKey(
      "store_x_variant",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "store_x_variant",
      new TableForeignKey({
        columnNames: ["variant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_variant",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("store_x_variant", true);
  }
}
