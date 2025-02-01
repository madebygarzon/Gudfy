import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Wallet1728007718219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "wallet" (
        "id" character varying NOT NULL,
        "store_id" character varying NOT NULL,
        "wallet_address" character varying NOT NULL,
        "available_balance" decimal(10,2) NOT NULL,
        "outstanding_balance" decimal(10,2) NOT NULL,
        "balance_paid" decimal(10,2) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    await queryRunner.createPrimaryKey("wallet", ["id"]);

    await queryRunner.createForeignKey(
      "wallet",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("wallet", true);
  }
}
