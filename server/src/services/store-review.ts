import { TransactionBaseService } from "@medusajs/medusa";
import { StoreReviewRepository } from "../repositories/store-review";

export default class StoreReviewService extends TransactionBaseService {
  protected readonly storeReviewRepository_: typeof StoreReviewRepository;

  constructor({ storeReviewRepository }) {
    super(arguments[0]);
    this.storeReviewRepository_ = storeReviewRepository;
  }
  async getStarsStoreReviews(store_id) {
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const calculeStars = await storeReviewRepository
      .createQueryBuilder()
      .select("rating, COUNT(*) as cantidad")
      .where({ store_id, approved: true })
      .groupBy("rating")
      .getRawMany();
    const total = calculeStars.reduce((acumulador, objeto) => {
      return acumulador + parseInt(objeto.cantidad);
    }, 0);
    const media =
      calculeStars.reduce((acumulador, objeto) => {
        return acumulador + parseInt(objeto.cantidad) * parseInt(objeto.rating);
      }, 0) / total;
    return { dataStars: calculeStars, total, media };
  }

  async getStoreReviews(store_id, next) {
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    if (next) {
      return await storeReviewRepository.find({
        where: {
          store_id,
          approved: true,
        },
        order: {
          created_at: "DESC",
        },
        take: 5 * next,
      });
    } else {
      return await storeReviewRepository.find({
        where: {
          store_id,
          approved: true,
        },
        order: {
          created_at: "DESC",
        },
      });
    }
  }

  async getCustomerStoreReviews(customer_id) {
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    return await storeReviewRepository.find({
      where: {
        customer_id,
        approved: true,
      },
    });
  }

  async getReview(id) {
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    return await storeReviewRepository.findOne({
      where: {
        id,
      },
    });
  }
  async commented(store_order_id) {
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const reviews = await storeReviewRepository.find({
      where: {
        store_order_id,
      },
    });
    return reviews.map((review) => review.store_id);
  }

  async create(
    store_id,
    store_order_id,
    customer_id,
    customer_name,
    content,
    rating
  ) {
    if (
      !store_id ||
      !store_order_id ||
      !customer_id ||
      !customer_name ||
      !content ||
      !rating
    ) {
      throw new Error(
        "Adding store review requires store_store_variant_id, customer_id, content, and rating"
      );
    }
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const createdReview = storeReviewRepository.create({
      store_id,
      store_order_id,
      customer_id,
      customer_name,
      content,
      rating,
      approved: true,
    });
    const storeReview = await storeReviewRepository.save(createdReview);
    return storeReview;
  }

  async update(id_review, content, rating) {
    if (!id_review || !content || !rating) {
      throw new Error(
        "Updating a store review requires id, content, rating, and approved"
      );
    }
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const storeReview = storeReviewRepository.update(id_review, {
      content,
      rating,
      approved: false,
    });
    return storeReview;
  }

  async delete(id) {
    if (!id) {
      throw new Error("Deleting a store review requires id");
    }
    /* @ts-ignore */
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const storeReview = storeReviewRepository.delete(id);
    return storeReview;
  }
}
