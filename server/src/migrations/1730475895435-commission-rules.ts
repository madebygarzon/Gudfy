import { MigrationInterface, QueryRunner } from "typeorm";

export class CommissionRules1700000000001 implements MigrationInterface {
  name = "CommissionRules1700000000001";

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE commission_rule (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id   varchar REFERENCES product_category(id) ON DELETE CASCADE,
        rate          numeric(5,4) NOT NULL,   -- 0.0200 = 2 %
        priority      int DEFAULT 0,
        valid_from    timestamptz,
        valid_to      timestamptz,
        metadata      jsonb,
        CONSTRAINT rule_target CHECK (category_id IS NOT NULL)
      );
      CREATE INDEX commission_rule_active_idx
        ON commission_rule (category_id, valid_from, valid_to);
    `);

    await q.query(`
      CREATE TABLE commission_line (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id      varchar REFERENCES "order"(id) ON DELETE CASCADE,
        line_item_id  varchar REFERENCES line_item(id) ON DELETE CASCADE,
        store_id      varchar REFERENCES store(id),
        rate          numeric(5,4) NOT NULL,
        amount        numeric(14,2) NOT NULL,
        currency_code char(3) NOT NULL
      );
      CREATE INDEX commission_line_order_idx ON commission_line (order_id);
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE commission_line`);
    await q.query(`DROP TABLE commission_rule`);
  }
}
