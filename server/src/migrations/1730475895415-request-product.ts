import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class RequestProduct1730475895415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear la tabla request_product
    await queryRunner.createTable(
      new Table({
        name: "request_product",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "customer_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "product_title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "product_image",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "variants",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "approved",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "now()",
          },
        ],
      })
    );

    // Crear la relación con la tabla customer
    await queryRunner.createForeignKey(
      "request_product",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la relación
    await queryRunner.dropForeignKey(
      "request_product",
      "FK_customer_request_product"
    );

    // Eliminar la tabla request_product
    await queryRunner.dropTable("request_product");
  }
}
