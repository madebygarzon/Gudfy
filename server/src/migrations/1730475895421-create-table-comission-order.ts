import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";

export class CreateTableComissionOrder1730475895421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear la tabla product_comission si no existe
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product_comission" (
        "id" character varying NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL,
        "percentage" decimal(10,2) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    // Verificar si la columna product_comission_id existe en la tabla product
    const columnExists = await queryRunner.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product' AND column_name = 'product_comission_id'
      )`
    );
    
    // Agregar la columna solo si no existe
    if (!columnExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "product_comission_id" varchar NULL`
      );
    }

    // Verificar si la foreign key ya existe
    const fkExists = await queryRunner.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'product' 
        AND ccu.table_name = 'product_comission'
        AND ccu.column_name = 'id'
      )`
    );
    
    // Crear la foreign key solo si no existe
    if (!fkExists[0].exists) {
      // Generar un nombre único para la foreign key
      const fkName = `fk_product_comission_${Date.now()}`;
      
      await queryRunner.query(
        `ALTER TABLE "product" ADD CONSTRAINT "${fkName}" 
         FOREIGN KEY ("product_comission_id") REFERENCES "product_comission"("id") 
         ON DELETE SET NULL ON UPDATE CASCADE`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la tabla product existe
    const tableExists = await queryRunner.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'product'
      )`
    );

    if (tableExists[0].exists) {
      // Verificar si existe alguna foreign key que apunte a product_comission
      const fkExists = await queryRunner.query(
        `SELECT constraint_name FROM information_schema.table_constraints tc
         JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
         WHERE tc.constraint_type = 'FOREIGN KEY' 
         AND tc.table_name = 'product' 
         AND ccu.table_name = 'product_comission'
         LIMIT 1`
      );

      // Eliminar la foreign key si existe
      if (fkExists && fkExists.length > 0) {
        await queryRunner.query(
          `ALTER TABLE "product" DROP CONSTRAINT IF EXISTS "${fkExists[0].constraint_name}"`
        );
      }

      // Verificar si la columna product_comission_id existe
      const columnExists = await queryRunner.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'product' AND column_name = 'product_comission_id'
        )`
      );

      // Eliminar la columna si existe
      if (columnExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "product" DROP COLUMN IF EXISTS "product_comission_id"`
        );
      }
    }

    // Eliminar la tabla product_comission si existe
    await queryRunner.query(`DROP TABLE IF EXISTS "product_comission"`);
  }
}