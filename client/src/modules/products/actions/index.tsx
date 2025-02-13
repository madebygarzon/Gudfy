import { StoreGetProductsParams } from "@medusajs/medusa"
import { listProductVariantCategory } from "./get-list-product-variant-categort"

type FetchProductListParams = {
  pageParam?: number
  queryParams: StoreGetProductsParams
}
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const fetchProductsListTab = async ({
  pageParam = 0,
  queryParams,
}: FetchProductListParams) => {
  if (queryParams.category_id) {
    const { products, count, offset } = await listProductVariantCategory({
      limit: 6,
      offset: pageParam,
      category_id: queryParams.category_id[0],
    })

    // await medusaClient.products.list({
    //   limit: 3,
    //   offset: pageParam,
    //   ...queryParams,
    // })}

    return {
      response: { products, count },
      nextPage: count > offset + 6 ? offset + 6 : null,
    }
  }
}
