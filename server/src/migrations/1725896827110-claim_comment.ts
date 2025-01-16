import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class ClaimComment1725896827110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "claim_comment" (
          "id" character varying NOT NULL,
          "comment" text NOT NULL,
          "comment_owner_id" character varying NOT NULL,
          "order_claim_id" character varying,
          "image" varchar character varying NULL,
          "customer_id" character varying NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          PRIMARY KEY ("id")
        )
      `);

    await queryRunner.createForeignKey(
      "claim_comment",
      new TableForeignKey({
        columnNames: ["order_claim_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order_claim",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "claim_comment",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "claim_comment",
      new TableForeignKey({
        columnNames: ["comment_owner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "comment_owner",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS "claim_comment"
          `);
  }
}
