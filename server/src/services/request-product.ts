import { Lifetime } from "awilix";
import RequestProductRepository from "../repositories/request-product";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { EmailRequestProductApproved, EmailRequestProductRejected } from "../admin/components/email/request-product.ts";

class RequestProductService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly requestProductRepository_: typeof RequestProductRepository;
  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.requestProductRepository_ = container.requestProductRepository;
  }

  async addRequestProduct(data: {
    customer_id: string;
    product_title: string;
    product_image: string;
    description: string;
    variants: string;
    approved: boolean;
  }) {
    try {
      const repoReqPro = this.activeManager_.withRepository(
        this.requestProductRepository_
      );

      const createReqProd = await repoReqPro.create(data);

      const saveDataReqProd = await repoReqPro.save(createReqProd);

      return true;
    } catch (error) {
      console.log("error en la creacion de la peticion del producto", error);
    }
  }

  async getListRequestFromCustomer(customer_id) {
    try {
      const repoReqPro = this.activeManager_.withRepository(
        this.requestProductRepository_
      );

      const createReqProd = await repoReqPro.find({
        where: {
          customer_id,
        },
      });

      return createReqProd;
    } catch (error) {
      console.log(
        "error en la recuperacion del listado  de la solicitud de producto por vendedor",
        error
      );
    }
  }

  async getAllListRequest() {
    try {
      const repoReqPro = this.activeManager_.withRepository(
        this.requestProductRepository_
      );

      const listAllReqProd = await repoReqPro
        .createQueryBuilder("rp")
        .innerJoinAndSelect("rp.customer", "c")
        .innerJoinAndSelect("c.store", "s")
        .select([
          "rp.id AS request_id",
          "rp.customer_id AS seller_id",
          "rp.product_title AS product_title",
          "rp.product_image AS product_image",
          "rp.description AS description",
          "rp.variants AS variants",
          "rp.approved AS approved",
          "rp.created_at AS created_at",
          "rp.status AS status",
          "rp.note AS note",
          "s.name AS store_name ",
          "c.email AS customer_email",
          "s.id AS store_id",
        ])
        .getRawMany();

      return listAllReqProd;
    } catch (error) {
      console.log(
        "error en la recuperacion del listado de todas las solicitudes de producto",
        error
      );
    }
  }

  async updateRequest(id, product) {
    try {
    
      const repoReqPro = this.activeManager_.withRepository(
        this.requestProductRepository_
      );

      const dataSeller = await repoReqPro
        .createQueryBuilder("rp")
        .innerJoinAndSelect("rp.customer", "c")
        .innerJoinAndSelect("c.store", "s")
        .where("rp.id = :id", { id })
        .select([
          "rp.id AS request_id",
          "rp.customer_id AS seller_id",
          "rp.product_title AS product_title",
          "rp.description AS description",
          "rp.variants AS variants",
          "rp.approved AS approved",
          "rp.created_at AS created_at",
          "rp.status AS status",
          "rp.note AS note",
          "s.name AS store_name ",
          "c.email AS customer_email",
          "s.id AS store_id",
        ])
        .getRawOne();
      const update = await repoReqPro.update(id, {
        approved: true,
        product_title: product.product_title,
        product_image: product.product_image,
        description: product.description,
        variants: product.variants,
        status: product.status,
        note: product.note,
      });

      if (product.status === "A") {
        EmailRequestProductApproved({
          title_product: dataSeller.product_title,
          store_name: dataSeller.store_name,
          customer_email: dataSeller.customer_email,
          variants: product.variants,
          note: product.note,
        });
      }

      if (product.status === "B") {
        EmailRequestProductRejected({
          title_product: dataSeller.product_title,
          store_name: dataSeller.store_name,
          customer_email: dataSeller.customer_email,
          note: product.note,
          variants: dataSeller.variants,
        });
      }

      return true;
    } catch (error) {
      console.log("error en la actualizacion del producto", error);
    }
  }
}
export default RequestProductService;
