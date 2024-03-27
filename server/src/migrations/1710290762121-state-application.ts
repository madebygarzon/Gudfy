import { MigrationInterface, QueryRunner } from "typeorm";

export class StateApplication1710290762121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "state_application"(
            "id" character varying NOT NULL,
            "state" character varying NOT NULL,
            "description" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`);
    await queryRunner.createPrimaryKey("state_application", ["id"]);
    await queryRunner.query(
      `INSERT INTO "state_application" ("id", "state", "description") VALUES
            ('A','aprobada','Cuando la solicitud cumple con la mayoría o todos sus parámetros y es aprobada por el usuario administrador.'),
            ('B','rechazado','Cuando la solicitud falló con todos o algunos de sus parámetros y fue rechazada por el usuario administrador'),
            ('C','pendiente','Valor predeterminado para cuando la solicitud fue enviada por el solicitante vendedor.'),
            ('D','correccion','Cuando la solicitud es enviada para corrección por parte del usuario administrador.'),
            ('E','corregido','Cuando la solicitud ha sido corregida por el solicitante.')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "state_application"`);
  }
}
