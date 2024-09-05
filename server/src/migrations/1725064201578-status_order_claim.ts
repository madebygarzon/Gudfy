import { MigrationInterface, QueryRunner } from "typeorm";

export class StatusOrderClaim1725064201578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "status_order_claim" (
            "id" character varying NOT NULL,
            "status" character varying NOT NULL,
            "description" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`);
    await queryRunner.createPrimaryKey("status_order_claim", ["id"]);
    await queryRunner.query(
      `INSERT INTO "status_order_claim" ("id", "status", "description") VALUES
                ('OPEN_ID', 'ABIERTA', 'La reclamación está en proceso y abierta para ser resuelta.'),
                ('CANCEL_ID', 'CERRADA', 'La reclamación ha sido cancelada y cerrada.'),
                ('UNSOLVED_ID', 'SIN RESOLVER', 'La reclamación no ha sido resuelta y permanece sin solución.'),
                ('SOLVED_ID', 'RESUELTA', 'La reclamación ha sido resuelta exitosamente.')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "status_order_claim"`);
  }
}
