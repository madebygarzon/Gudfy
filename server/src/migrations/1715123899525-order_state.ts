import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderState1715123899525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "order_status" (
          "id" character varying NOT NULL,
          "state" character varying NOT NULL,
          "description" character varying,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_order_status" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`INSERT INTO "order_status" ("id","state","description") VALUES 
      ('Paid_ID','Pagado','Cuando un producto a sido pagado'),
      ('Payment_Pending_ID','Pendiente de pago','Cuando la orden ya esta diligenciada'),
      ('Completed_ID','Completado', 'Cuando ya esta pagada pero aun no se libera el dinero al vendedor'),
      ('Finished_ID','Finalizado','Cuando ambas partes aprobaron el producto o  se cumplio el tiempo de revisión'),
      ('Discussion_ID','En discusión','Cuando surge un problema en la orden')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE IF EXISTS "order_status"
  `);
  }
}
