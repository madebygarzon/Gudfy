import { TransactionBaseService } from "@medusajs/medusa"

export default class CommissionService extends TransactionBaseService {
  async getRate(opts: { productId: string }): Promise<number> {
    if (process.env.ENABLE_DYNAMIC_COMMISSION !== "true")
      return Number(process.env.COMMISSION ?? 0.01)

    const { productId } = opts
    const rule = await this.manager_.query(
      `
      SELECT cr.rate
      FROM commission_rule cr
      JOIN commission_group_product cgp ON cgp.group_id = cr.group_id
      WHERE cgp.product_id = $1
        AND (cr.valid_from IS NULL OR cr.valid_from <= now())
        AND (cr.valid_to   IS NULL OR cr.valid_to   >= now())
      ORDER BY cr.priority DESC
      LIMIT 1
      `,
      [productId]
    )
    return Number(rule[0]?.rate ?? process.env.COMMISSION ?? 0.01)
  }
}
