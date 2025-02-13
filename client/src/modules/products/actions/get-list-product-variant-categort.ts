import axios from "axios"
import { BACKEND_URL } from "../../account/actions"
type listProductVariant = {
  limit: number
  offset: number
  category_id: string
}

export async function listProductVariantCategory({
  limit,
  offset,
  category_id,
}: listProductVariant) {
  const params = {
    limit,
    offset,
    category_id,
  }

  const getListProductVaraintCategory = await axios.get(
    `${BACKEND_URL}/store/list-products-variant-category/`,
    { params, withCredentials: true }
  )

  return getListProductVaraintCategory.data
}
