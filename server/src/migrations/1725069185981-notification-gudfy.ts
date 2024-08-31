import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationGudfy1725069185981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "notification_gudfy"(
            "id" character varying NOT NULL,
            "order_claim_id" character varying,
            "notification_type_id" character varying NOT NULL,
            "customer_id" character varying,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`);
    await queryRunner.createPrimaryKey("notification_gudfy", ["id"]);
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" ADD CONSTRAINT "FK_order_claim" FOREIGN KEY ("order_claim_id") REFERENCES "order_claim"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" ADD CONSTRAINT "FK_notification_type" FOREIGN KEY ("notification_type_id") REFERENCES "notification_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" ADD CONSTRAINT "FK_customer" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" DROP CONSTRAINT "FK_order_claim"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" DROP CONSTRAINT "FK_notification_type"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification_gudfy" DROP CONSTRAINT "FK_customer"`
    );

    // Eliminar la tabla "notification_gudfy"
    await queryRunner.query(`DROP TABLE "notification_gudfy"`);
  }
}
