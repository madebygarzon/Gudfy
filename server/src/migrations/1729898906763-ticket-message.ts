import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class TicketMessage1729898906763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "ticket_messages" (
          "id" character varying NOT NULL,
          "ticket_id" character varying NOT NULL,
          "owner_id" character varying NOT NULL,
          "message" text,
          "image" varchar,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.createPrimaryKey("ticket_messages", ["id"]);

    await queryRunner.createForeignKeys("ticket_messages", [
      new TableForeignKey({
        columnNames: ["ticket_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "ticket",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["owner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "comment_owner",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ticket_messages", true);
  }
}
