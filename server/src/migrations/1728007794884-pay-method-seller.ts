import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class PayMethodSeller1728007794884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "pay_method_seller" (
        "id" character varying NOT NULL,
        "method" character varying NOT NULL,
        "account_number" character varying NOT NULL,
        "wallet_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    await queryRunner.createPrimaryKey("pay_method_seller", ["id"]);

    await queryRunner.createForeignKey(
      "pay_method_seller",
      new TableForeignKey({
        columnNames: ["wallet_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "wallet",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("pay_method_seller", true);
  }
}
