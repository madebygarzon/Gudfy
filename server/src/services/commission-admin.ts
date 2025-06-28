import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa"
import CommissionGroupRepository from "../repositories/commission-group"
import CommissionRuleRepository from "../repositories/commission-rule"

export default class CommissionAdminService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly commissionGroupRepository_: typeof CommissionGroupRepository
  protected readonly commissionRuleRepository_: typeof CommissionRuleRepository

  constructor({ commissionGroupRepository, commissionRuleRepository }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.commissionGroupRepository_ = commissionGroupRepository
    this.commissionRuleRepository_ = commissionRuleRepository
  }

  async listGroups() {
    const repo = this.manager_.withRepository(this.commissionGroupRepository_)
    const groups = await repo
      .createQueryBuilder("cg")
      .leftJoinAndSelect("cg.rules", "cr")
      .getMany()
    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      rate: g.rules?.[0]?.rate ?? null,
    }))
  }

  async createGroup(name: string, rate: number) {
    const repo = this.manager_.withRepository(this.commissionGroupRepository_)
    const ruleRepo = this.manager_.withRepository(this.commissionRuleRepository_)

    const group = repo.create({ name })
    await repo.save(group)
    const rule = ruleRepo.create({ rate, group_id: group.id })
    await ruleRepo.save(rule)
    return { id: group.id, name: group.name, rate: rule.rate }
  }

  async updateGroup(id: string, name: string, rate: number) {
    const repo = this.manager_.withRepository(this.commissionGroupRepository_)
    const ruleRepo = this.manager_.withRepository(this.commissionRuleRepository_)
    const group = await repo.findOne({ where: { id } })
    if (!group) {
      throw new Error("Group not found")
    }
    group.name = name
    await repo.save(group)
    let rule = await ruleRepo.findOne({ where: { group_id: id } })
    if (!rule) {
      rule = ruleRepo.create({ group_id: id, rate })
    } else {
      rule.rate = rate
    }
    await ruleRepo.save(rule)
    return { id: group.id, name: group.name, rate: rule.rate }
  }

  async deleteGroup(id: string) {
    const repo = this.manager_.withRepository(this.commissionGroupRepository_)
    await repo.delete({ id })
  }
}
