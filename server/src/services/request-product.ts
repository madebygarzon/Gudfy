import { Lifetime } from "awilix";
import RequestProductRepository from "../repositories/request-product";

import { TransactionBaseService, Customer } from "@medusajs/medusa";

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

  async updateRequest(id) {
    const repoReqPro = this.activeManager_.withRepository(
      this.requestProductRepository_
    );

    const update = await repoReqPro.update(id, {
      approved: true,
    });

    return true;
  }
}
export default RequestProductService;
