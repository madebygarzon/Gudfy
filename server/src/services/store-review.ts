import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { StoreReviewRepository } from "../repositories/store-review";

export default class StoreReviewService extends TransactionBaseService {
  protected readonly storeReviewRepository_: typeof StoreReviewRepository;
  protected readonly loggedInCustomer_: Customer | null | undefined;

  constructor({ storeReviewRepository, loggedInCustomer }) {
    super(arguments[0]);
    this.storeReviewRepository_ = storeReviewRepository;
    this.loggedInCustomer_ = loggedInCustomer;
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
  async getDataReviews() {
    try {
      const storeReviewRepository = this.activeManager_.withRepository(
        this.storeReviewRepository_
      );
      const storeId = this.loggedInCustomer_.store_id;

      if (!storeId) {
        throw new Error(
          "No existen parámetros relacionados para recuperar los reviews"
        );
      }

      const count = await storeReviewRepository.count({
        where: {
          store_id: storeId,
          approved: true,
        },
      });

      if (count === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          latestComment: null,
        };
      }

      // Calcular el promedio de ratings
      const { avg } = await storeReviewRepository
        .createQueryBuilder("review")
        .select("AVG(review.rating)", "avg")
        .where("review.store_id = :storeId", { storeId })
        .andWhere("review.approved = :approved", { approved: true })
        .getRawOne();

      const latestComment = await storeReviewRepository.findOne({
        where: {
          store_id: storeId,
          approved: true,
        },
        order: {
          created_at: "DESC",
        },
      });

      return {
        totalReviews: count,
        rating: (parseFloat(avg) * 100) / 5,
        latestComment: latestComment || null,
      };
    } catch (error) {
      console.log("Error en el servicio", error);
      throw error;
    }
  }

  async getStoreReviews(next) {
    try {
      const storeReviewRepository = this.activeManager_.withRepository(
        this.storeReviewRepository_
      );
      if (next && this.loggedInCustomer_.store_id) {
        const reviews = await storeReviewRepository.find({
          where: {
            store_id: this.loggedInCustomer_.store_id,
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

  async getCustomerStoreReviews(customer_id) {
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
      approved: false,
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
    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const storeReview = storeReviewRepository.delete(id);
    return storeReview;
  }
}
