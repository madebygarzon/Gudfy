import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { CommissionGroup } from "../models/commission-group"

export const CommissionGroupRepository = dataSource.getRepository(CommissionGroup)

export default CommissionGroupRepository
