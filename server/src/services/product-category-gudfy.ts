import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa"
import ProductCategoryRepository from "../repositories/product-category-gudfy"

export default class ProductCategoryGudfyService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED

  protected readonly productCategoryRepository_: typeof ProductCategoryRepository

  constructor({ productCategoryRepository }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.productCategoryRepository_ = productCategoryRepository
  }

  async addImageToCategory(id: string, image: string) {
    const repo = this.manager_.withRepository(this.productCategoryRepository_)
    const category = await repo.findOne({ where: { id } })
    if (!category) {
      throw new Error("Category not found")
    }
    category.image_url = `${process.env.BACKEND_URL ?? "http://localhost:9000"}/${image}`
    await repo.save(category)
    return category
  }

  async listProductCategory() {
    try {
      const repo = this.manager_.withRepository(this.productCategoryRepository_)
      const categories = await repo.find()
      return categories
    } catch (error) {
      console.error("Error al listar categorías:", error)
      throw error
    }
  }
}
