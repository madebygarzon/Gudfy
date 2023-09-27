import { Router, json } from "express";
import customRouteHandler from "./custom-route-handler";
import postProductReviews from "./post-product-reviews";
import getProductAllReviews from "./get-product-allReviews";
import { authenticate, authenticateCustomer } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/medusa";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/products/:id/reviews", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(getProductAllReviews));

  router.use("/store/products/:id/reviews", json());
  router.post("/", authenticateCustomer(), wrapHandler(postProductReviews));
}
