import Medusa from "@medusajs/medusa-js";
import { BACKEND } from "../index";
const medusa = new Medusa({
  baseUrl: BACKEND,
  maxRetries: 3,
});
// must be previously logged in or use api token
async function ProductList() {
  const productList = await medusa.admin.products.list().then((p) => ({
    products: p.products,
    count: p.count,
  }));

  return productList;
}

export default ProductList;
