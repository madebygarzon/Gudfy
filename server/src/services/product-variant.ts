import { Lifetime } from "awilix";
import {
  FindConfig,
  ProductVariantService as MedusaProductVariantService,
  ProductService,
  
} from "@medusajs/medusa";
import  RequestProductService  from "./request-product";
import  ProductGudfyService  from "./product-gudfy";

class ProductVariantService extends MedusaProductVariantService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly requestProductService_: RequestProductService;
  protected readonly productGudfyService_: ProductGudfyService;
  protected container_: any;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.container_ = container;
    this.requestProductService_ = container.requestProductService;
    this.productGudfyService_ = container.productGudfyService;
  }

  get productService_(): ProductService {
    return this.container_.productService;
  }

  async createProductVariantGudfy(
    product: {
      request_id: string;
      product_title: string;
      seller_id: string;
      variants: string;
      product_image: string;
      description: string;
      product_comission_id: string;
    },
    image?: {path: string}
  ) {
    try {
      
      const productMedusa = await this.productService_.create({
        title: product.product_title,
        thumbnail: image ? process.env.BACKEND_URL + "/" + image.path : product.product_image,
        description: product.description,
        variants : product.variants.split(",").map(variant => {
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
      
      await this.productGudfyService_.updateProductCommission( productMedusa.id,product.product_comission_id);

       await this.requestProductService_.updateRequest(product.request_id,  {...product, product_image: image ? process.env.BACKEND_URL + "/" +image.path : product.product_image});
      return true;
    } catch (error) {
      console.log("Error al crear el producto", error);
    }
  }
}

export default ProductVariantService;
