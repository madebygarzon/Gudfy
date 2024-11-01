import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Tickets1729898891216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "ticket" (
          "id" character varying NOT NULL,
          "status_id" character varying NOT NULL,
          "customer_id" character varying NOT NULL,
          "subject" varchar NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("ticket", ["id"]);

    await queryRunner.createForeignKeys("ticket", [
      new TableForeignKey({
        columnNames: ["status_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "ticket_status",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ticket", true);
  }
}
