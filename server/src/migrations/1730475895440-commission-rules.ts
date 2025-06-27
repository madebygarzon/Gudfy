import { MigrationInterface, QueryRunner } from "typeorm"

export class CommissionGroups1700000000002 implements MigrationInterface {
  name = "CommissionGroups1700000000002"

 public async up(q: QueryRunner): Promise<void> {
  await q.query(`
    CREATE TABLE commission_group (
      id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL
    );

    CREATE TABLE commission_group_product (
      group_id   uuid   REFERENCES commission_group(id) ON DELETE CASCADE,
      product_id varchar REFERENCES product(id)        ON DELETE CASCADE,
      PRIMARY KEY (group_id, product_id)
    );

    -- Si no existe, la añadimos (nunca fallará si ya estaba)
    ALTER TABLE commission_rule
      ADD COLUMN IF NOT EXISTS price_list_id varchar
        REFERENCES price_list(id) ON DELETE CASCADE;

    ALTER TABLE commission_rule
      ADD COLUMN group_id uuid
        REFERENCES commission_group(id) ON DELETE CASCADE;

    -- Reescribimos la restricción
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'rule_target'
          AND conrelid = 'commission_rule'::regclass
      ) THEN
        ALTER TABLE commission_rule DROP CONSTRAINT rule_target;
      END IF;
    END$$;

    ALTER TABLE commission_rule
      ADD CONSTRAINT rule_target CHECK (
            (category_id   IS NOT NULL)::int +
            (price_list_id IS NOT NULL)::int +
            (group_id      IS NOT NULL)::int = 1
      );
  `)
}


  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE commission_rule DROP COLUMN group_id`)
    await q.query(`DROP TABLE commission_group_product`)
    await q.query(`DROP TABLE commission_group`)
    await q.query(`
      ALTER TABLE commission_rule
        DROP CONSTRAINT rule_target,
        ADD  CONSTRAINT rule_target CHECK (category_id IS NOT NULL)
    `)
  }
}
