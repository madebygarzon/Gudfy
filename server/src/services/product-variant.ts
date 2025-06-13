import { Lifetime } from "awilix";
import {
  FindConfig,
  ProductVariantService as MedusaProductVariantService,
  ProductService,
  
} from "@medusajs/medusa";
import  RequestProductService  from "./request-product";

class ProductVariantService extends MedusaProductVariantService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly requestProductService_: RequestProductService;

  protected container_: any;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.container_ = container;
    this.requestProductService_ = container.requestProductService;
  }

  // Acceder a productService de forma tardía para evitar dependencia circular
  get productService_(): ProductService {
    return this.container_.productService;
  }

  async createProductVariantGudfy(
    product: {
      request_id: string;
      product_title: string;
      variants: string[];
      product_image: string;
      description: string;
    },
    image?: {path: string}
  ) {
    try {

      const productMedusa = await this.productService_.create({
        title: product.product_title,
        thumbnail: image ? process.env.BACKEND_URL + "/" + image.path : product.product_image,
        description: product.description,
        variants : product.variants.map(variant => {
          return {
            title: variant,
            inventory_quantity: 0,
            prices: [
              {
                currency_code: "USD",
                amount: 0,
              },
            ],
          }
        })
      });

       await this.requestProductService_.updateRequest(product.request_id,  {...product, product_image: image ? process.env.BACKEND_URL + "/" +image.path : product.product_image});
      return true;
    } catch (error) {
      console.log("Error al crear el producto", error);
    }
  }
}

export default ProductVariantService;
