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
            ('A','approved', 'When the request met all or most of its parameters and was approved by the administrator user.'),
            ('B','rejected','When the request failed with all or some of its parameters and was rejected by the administrator user.'),
            ('C','pending', 'Default value for when the request was submitted by the seller applicant.'),
            ('D','correct', 'When the request is sent for correction by the administrator user.'),
            ('E','corrected','When the request has been corrected by the applicant.')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "state_application"`);
  }
}
