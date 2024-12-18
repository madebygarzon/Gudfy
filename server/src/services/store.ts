import { Lifetime } from "awilix";
import {
  FindConfig,
  StoreService as MedusaStoreService,
  Store,
  Customer,
} from "@medusajs/medusa";
import StoreXVariantRepository from "../repositories/store-x-variant";
import { StoreReviewRepository } from "../repositories/store-review";

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeReviewRepository_: typeof StoreReviewRepository;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.storeReviewRepository_ = container.storeReviewRepository;
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
  async getSellerRating(store_id) {
    const repoStoreReview = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );

    const reviews = await repoStoreReview.find({
      where: {
        store_id: store_id,
      },
    });

    if (!reviews.length) return 0;

    const sum = reviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    return ((sum / reviews.length) * 100) / 5;
  }

  async updateNameStore(newName) {
    const repoStore = this.manager_.withRepository(this.storeRepository_);
    const id = this.loggedInCustomer_.store_id;

    const update = await repoStore.update(id, {
      name: newName,
      change_name: true,
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

  async retrieveSeller(idStore) {
    try {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);

      const dataStore = await storeRepo
        .createQueryBuilder("s")
        .innerJoinAndSelect("s.store_x_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "pv")
        .innerJoinAndSelect("pv.product", "p")
        .where("s.id = :storeId ", {
          storeId: idStore,
        })
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "s.avatar AS avatar",
          "sxv.id AS store_variant_id",
          "sxv.quantity_store AS quantity",
          "sxv.price AS price",
          "pv.title AS title_variant",
          "p.title AS parent_title",
          "p.thumbnail AS thumbnail",
          "p.description AS desciption",
        ])
        .getRawMany();

      const storeMap = new Map();

      for (const store of dataStore) {
        if (!storeMap.has(store.store_id)) {
          storeMap.set(store.store_id, {
            store_id: store.store_id,
            avatar: store.avatar,
            store_name: store.store_name,
            store_rating: await this.getSellerRating(store.store_id),
            store_number_sales: await this.getNumberOfSales(store.store_id),
            variants: [
              {
                store_variant_id: store.store_variant_id,
                quantity: store.quantity,
                price: store.price,
                titleVariant: store.title_variant,
                parent_title: store.parent_title,
                thumbnail: store.thumbnail,
                desciption: store.desciption,
              },
            ],
          });
        } else {
          storeMap.get(store.store_id).variants.push({
            store_variant_id: store.store_variant_id,
            quantity: store.quantity,
            price: store.price,
            titleVariant: store.title_variant,
            parent_title: store.parent_title,
            thumbnail: store.thumbnail,
            desciption: store.desciption,
          });
        }
      }
      const data = Array.from(storeMap.values());

      return data[0];
    } catch (error) {
      console.log("Error al recuperar la tienda del cliente", error);
    }
  }

  async getSellerStoreReviews(store_id, next = 1) {
    try {
      const storeReviewRepository = this.activeManager_.withRepository(
        this.storeReviewRepository_
      );
      if (next && store_id) {
        const reviews = await storeReviewRepository.find({
          where: {
            store_id: store_id,
            approved: true,
          },
          order: {
            created_at: "DESC",
          },
          take: 5 * next,
        });
        if (!reviews.length) return [];

        return reviews;
      } else {
        throw new Error(
          "No existen parametros relacionados para recuperar los reviews"
        );
      }
    } catch (error) {
      console.log("Error en el servicio al enlistar los commentarios", error);
    }
  }
}

export default StoreService;
