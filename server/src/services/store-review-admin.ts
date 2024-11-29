import { TransactionBaseService } from "@medusajs/medusa";
import { StoreReviewRepository } from "../repositories/store-review";

export default class StoreReviewAdminService extends TransactionBaseService {
  protected readonly storeReviewRepository_: typeof StoreReviewRepository;

  constructor({ storeReviewRepository }) {
    super(arguments[0]);
    this.storeReviewRepository_ = storeReviewRepository;
  }

  async update(review_id, payload) {
    if (!review_id) {
      throw new Error(
        "Updating a store review requires id, content, rating, and approved"
      );
    }

    const storeReviewRepository = this.activeManager_.withRepository(
      this.storeReviewRepository_
    );
    const storeReview = storeReviewRepository.update(review_id, {
      approved: payload,
    });
    return storeReview;
  }
}
