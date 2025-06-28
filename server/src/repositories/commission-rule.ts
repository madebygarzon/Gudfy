import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { CommissionRule } from "../models/commission-rule"

export const CommissionRuleRepository = dataSource.getRepository(CommissionRule)

export default CommissionRuleRepository
