import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from "typeorm";

export class AddColumnsPriceAndOrder1730475895420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Añadir columna original_price_for_uniti (precio original por unidad)
    await queryRunner.addColumn(
      "store_variant_order",
      new TableColumn({
        name: "original_price_for_uniti",
        type: "numeric",
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );

    // Añadir columna commission_order (comisión de la orden)
    await queryRunner.addColumn(
      "store_variant_order",
      new TableColumn({
        name: "commission_order",
        type: "numeric",
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columna commission_order
    await queryRunner.dropColumn("store_variant_order", "commission_order");

    // Eliminar columna original_price_for_uniti
    await queryRunner.dropColumn("store_variant_order", "original_price_for_uniti");
  }
}
