import { Router, json } from "express";
import customRouteHandler from "./custom-route-handler";
import postProductReviews from "./post-product-reviews";
import getProductAllReviews from "./get-product-allReviews";
import getStarsProduct from "./get-stars-product";
import { authenticate, authenticateCustomer } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/medusa";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/", router, json());
  // Define a GET endpoint on the root route of our custom path
  router.get("/products/:id/reviews", wrapHandler(getProductAllReviews));
  router.get("/products/:id/stars", wrapHandler(getStarsProduct));

  router.post(
    "/products/:id/reviews",
    authenticateCustomer(),
    wrapHandler(postProductReviews)
  );
}
