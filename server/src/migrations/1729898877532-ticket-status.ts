import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketStatus1729898877532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "ticket_status" (
          "id" character varying NOT NULL,
          "status" varchar NOT NULL,
          "description" varchar NOT NULL
        )`
    );

    await queryRunner.createPrimaryKey("ticket_status", ["id"]);

    await queryRunner.query(`
        INSERT INTO "ticket_status" ("id", "status", "description") VALUES
        ('Closed_ID', 'Cerrado', 'Cuando el ticket fue cerrado'),
        ('Open_ID', 'Abierto', 'Cuando el ticket está abierto y sin resolver'),
        ('Answered_ID', 'Contestado', 'Cuando el ticket ha sido respondido')
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ticket_status", true);
  }
}
