import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa"
import ProductComissionRepository from "../repositories/product-comission"
import ProductRepository from "../repositories/products"

export default class ProductGudfyService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly productComissionRepository_: typeof ProductComissionRepository
  protected readonly productRepository_: typeof ProductRepository

  constructor({ productComissionRepository, productRepository }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.productComissionRepository_ = productComissionRepository
    this.productRepository_ = productRepository
  }

  async listComissions() {
    const repo = this.manager_.withRepository(this.productComissionRepository_)
    const comissions = await repo.find()
    return comissions
  }

  async createComission(name: string, percentage: number) {
 
    const repo = this.manager_.withRepository(this.productComissionRepository_)
    const comission = await repo.create({ name, percentage })
    await repo.save(comission)
    return comission
  }

  async updateComission(id: string, name: string, percentage: number) {
    const repo = this.manager_.withRepository(this.productComissionRepository_)
    const comission = await repo.findOne({ where: { id } })
    if (!comission) {
      throw new Error("Comission not found")
    }
    comission.name = name
    comission.percentage = percentage
    await repo.save(comission)
    return comission
  }

  async deleteComission(id: string) {
    const repo = this.manager_.withRepository(this.productComissionRepository_)
    await repo.delete({ id })
  }

  async listProductWithComission() {
    const repo = this.manager_.withRepository(this.productRepository_)
    const products = await repo.find({
      relations: {
        product_comission: true,
      },
    })
   
    return products
  }

  async updateProductCommission(productId: string, commissionId: string | null) {
    const repo = this.manager_.withRepository(this.productRepository_)
    const product = await repo.update({ id: productId }, { product_comission_id: commissionId })
    return product
  }
}
