import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplicationData1710276981364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "application_data" (
              "id" character varying NOT NULL,
              "name" character varying NOT NULL,
              "last_name" character varying NOT NULL,
              "email" character varying NOT NULL,
              "phone" character varying NOT NULL,
              "contry" character varying NOT NULL,
              "city" character varying NOT NULL,
              "address" character varying NOT NULL,
              "postal_code" character varying NOT NULL,
              "supplier_name" character varying NOT NULL,
              "supplier_type" character varying NOT NULL,
              "company_name" character varying NOT NULL,
              "company_country" character varying NOT NULL,
              "company_city" character varying NOT NULL,
              "company_address" character varying NOT NULL,
              "supplier_documents" character varying NOT NULL,
              "quantity_products_sale" character varying NOT NULL,
              "example_product" character varying NOT NULL,
              "quantity_per_product" character varying NOT NULL,
              "current_stock_distribution" character varying NOT NULL,
              "front_identity_document" character varying NOT NULL,
              "revers_identity_document" character varying NOT NULL,
              "address_proof" character varying NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )`
    );
    await queryRunner.createPrimaryKey("application_data", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "application_data"`);
  }
}
