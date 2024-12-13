import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnSerialCode1730475895414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "customer",
      new TableColumn({
        name: "avatar",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "avatar",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "change_name",
        type: "boolean",
        isNullable: false,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("customer", "avatar");
    await queryRunner.dropColumn("store", "avatar");
    await queryRunner.dropColumn("store", "change_name");
  }
}
