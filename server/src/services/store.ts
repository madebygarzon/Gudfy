import { Lifetime } from "awilix";
import {
  FindConfig,
  StoreService as MedusaStoreService,
  Store,
  Customer,
} from "@medusajs/medusa";
import StoreXVariantRepository from "../repositories/store-x-variant";

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.storeXVariantRepository_ = container.storeXVariantRepository;
      this.loggedInCustomer_ = container.loggedInCustomer;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async retrieveStoreSeller() {
    try {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);
      const store = await storeRepo.findOne({
        relations: ["members"],
        where: {
          id: this.loggedInCustomer_.store_id,
        },
      });

      if (!store) {
        throw new Error("Unable to find the customer store");
      }
      return { ...store, parameters: await this.getNumberOfSales(store.id) };
    } catch (error) {
      console.log("Error al recuperar la tienda del cliente", error);
    }
  }

  async getNumberOfSales(seller_id) {
    const productV = this.manager_.withRepository(
      this.storeXVariantRepository_
    );

    const numberSales = await productV
      .createQueryBuilder("sxv")
      .innerJoinAndSelect("sxv.storeVariantOrder", "svo")
      .innerJoinAndSelect("svo.store_order", "so")
      .where("sxv.store_id = :store_id", {
        store_id: seller_id,
      })
      .andWhere("so.order_status_id = :status_id", {
        status_id: "Finished_ID",
      })
      .select()
      .getRawMany();

    const productCount = await productV.count({
      where: { store_id: seller_id }, // Si los productos están vinculados a una tienda específica
    });

    return { numberSales: numberSales.length, productCount };
  }

  async updateNameStore(newName) {
    const repoStore = this.manager_.withRepository(this.storeRepository_);
    const id = this.loggedInCustomer_.store_id;

    const update = await repoStore.update(id, {
      name: newName.includes("GF-") ? newName : `GF-${newName}`,
    });
    return true;
  }

  async updateAvatarStore(avatar) {
    const repoStore = this.manager_.withRepository(this.storeRepository_);
    const id = this.loggedInCustomer_.store_id;

    const update = await repoStore.update(id, {
      avatar: avatar,
    });
    return true;
  }
}

export default StoreService;
