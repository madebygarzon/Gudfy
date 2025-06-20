import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddRequestProductsColumn1730475895419 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
   
    await queryRunner.addColumn(
      "request_product",
      new TableColumn({
        name: "status",
        type: "character varying",
        default: "'C'",  
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      "request_product",
      new TableColumn({
        name: "note",
        type: "text",
        isNullable: true,  
      })
    );

    await queryRunner.createForeignKey(
      "request_product",
      new TableForeignKey({
        columnNames: ["status"],
        referencedColumnNames: ["id"],
        referencedTableName: "state_application",
        onDelete: "SET DEFAULT",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const foreignKey = await queryRunner
      .getTable("request_product")
      .then((table) =>
        table.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("status") !== -1
        )
      );
    
    if (foreignKey) {
      await queryRunner.dropForeignKey("request_product", foreignKey);
    }

    await queryRunner.dropColumn("request_product", "status");
    await queryRunner.dropColumn("request_product", "note");
  }
}
