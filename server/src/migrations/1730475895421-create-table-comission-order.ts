import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";

export class CreateTableComissionOrder1730475895421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product_comission" (
          "id" character varying NOT NULL,
          "name" character varying NOT NULL,
          "percentage" decimal(10,2) NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("product_comission", ["id"]);

    // Agregar columna product_comission_id a la tabla product
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "product_comission_id",
        type: "varchar",
        isNullable: true
      })
    );

    // Crear la relación con la tabla de productos
    await queryRunner.createForeignKey(
      "product",
      new TableForeignKey({
        columnNames: ["product_comission_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_comission",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la foreign key primero
    const table = await queryRunner.getTable("product");
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("product_comission_id") !== -1
    );
    await queryRunner.dropForeignKey("product", foreignKey);

    // Eliminar la columna product_comission_id
    await queryRunner.dropColumn("product", "product_comission_id");

    // Eliminar la tabla
    await queryRunner.dropTable("product_comission");
  }
}