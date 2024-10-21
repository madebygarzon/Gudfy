import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class PaymentDetail1728509380348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear la tabla payment_detail
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment_detail" (
          "id" character varying NOT NULL,
          "order_payments_id" character varying,
          "store_variant_order_id" character varying,
          "product_name" character varying,
          "product_price" decimal(10,2) NOT NULL,
          "quantity" integer NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    // Crear la clave primaria
    await queryRunner.createPrimaryKey("payment_detail", ["id"]);

    // Crear la llave foránea order_payments_id
    await queryRunner.createForeignKey(
      "payment_detail",
      new TableForeignKey({
        columnNames: ["order_payments_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order_payments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    // Crear la llave foránea store_variant_order_id
    await queryRunner.createForeignKey(
      "payment_detail",
      new TableForeignKey({
        columnNames: ["store_variant_order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_variant_order",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar las llaves foráneas
    await queryRunner.dropForeignKey("payment_detail", "FK_order_payments_id");
    await queryRunner.dropForeignKey(
      "payment_detail",
      "FK_store_variant_order_id"
    );

    // Eliminar la tabla payment_detail
    await queryRunner.dropTable("payment_detail", true);
  }
}
