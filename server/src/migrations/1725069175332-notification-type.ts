import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationType1725069175332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "notification_type"(
            "id" character varying NOT NULL,
            "type" character varying NOT NULL,
            "description" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`);
    await queryRunner.createPrimaryKey("notification_type", ["id"]);
    await queryRunner.query(
      `INSERT INTO "notification_type" ("id", "type", "description") VALUES
                  ('NOTI_CLAIM_ID','RECLAMO','Notificación relacionada a un reclamo')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notification_type"`);
  }
}
