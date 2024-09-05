import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentOwner1724424894173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "comment_owner"(
            "id" character varying NOT NULL,
            "owner" character varying NOT NULL,
            "description" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`);
    await queryRunner.createPrimaryKey("comment_owner", ["id"]);
    await queryRunner.query(
      `INSERT INTO "comment_owner" ("id", "owner", "description") VALUES
                  ('COMMENT_ADMIN_ID','Admin Gudfy','Comentarios por parte del administrador'),
                  ('COMMENT_STORE_ID','Store','Tienda relacionada al reclamo'),
                  ('COMMENT_CUSTOMER_ID','Customer','Cliente el cual realiza el reclamo')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment_owner"`);
  }
}
