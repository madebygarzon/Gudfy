import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from "typeorm";

export class AddColumnProductCategory1730475895423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "product_category",
      new TableColumn({
        name: "image_url",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("product_category", "image_url");
  }
}