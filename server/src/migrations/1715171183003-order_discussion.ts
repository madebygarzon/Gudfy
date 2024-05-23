import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class OrderDiscussion1715171183003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "order_discussion" (
              "id" character varying NOT NULL,
              "store_order_id" character varying NOT NULL,
              "comment" character varying NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`);
    await queryRunner.createPrimaryKey("order_discussion", ["id"]);
    await queryRunner.createForeignKey(
      "order_discussion",
      new TableForeignKey({
        columnNames: ["store_order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store_order",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("order_discussion", true);
  }
}
