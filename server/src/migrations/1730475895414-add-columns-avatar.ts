import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnSerialCode1730475895414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar el campo "avatar" a la tabla "customer"
    await queryRunner.addColumn(
      "customer",
      new TableColumn({
        name: "avatar",
        type: "varchar", // O 'string' dependiendo del dialecto SQL
        isNullable: true, // Permite valores nulos
      })
    );

    // Agregar el campo "avatar" a la tabla "store"
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "avatar",
        type: "varchar", // O 'string' dependiendo del dialecto SQL
        isNullable: true, // Permite valores nulos
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar el campo "avatar" de la tabla "customer"
    await queryRunner.dropColumn("customer", "avatar");

    // Eliminar el campo "avatar" de la tabla "store"
    await queryRunner.dropColumn("store", "avatar");
  }
}
