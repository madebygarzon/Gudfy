import { StoreReview } from "../models/store-review";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const StoreReviewRepository = dataSource.getRepository(StoreReview);
