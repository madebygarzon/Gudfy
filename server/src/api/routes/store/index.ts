import { Router, json } from "express";
import customRouteHandler from "./custom-route-handler";
import postProductReviews from "./post-product-reviews";
import postAccountSeller from "./post-account-seller";
import updateReview from "./update-review";
import getProductAllReviews from "./get-product-allReviews";
import getStarsProduct from "./get-stars-product";
import { authenticate, authenticateCustomer } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import deleteReview from "./delete-review";
import postSellerApplication from "./post-seller-application";
import getSellerApplication from "./get-seller-application";
import documents from "../../middlewares/documents-seller-application";
import UpdateSellerAplication from "./update-seller-application";
import getListProductsVariant from "./get-list-product-variant";
import { getListProductVariantWithSellers } from "./get-list-product-variant-with-sellers";
import { getProductVariant } from "./get-store-product-variant";
import postAddItem from "./post-add-item";
import getCartItems from "./get-cart-items";
import getCartVariantStock from "./get-cart-variant-stock";
import updateLine_item from "./update-line_item";
import postAddOrder from "./post-add-order";
import postCheckout from "./post-checkout";
import deleteStoreOrder from "./delete-store-order";
import { getListCustomerOrders } from "./get-list-customer-orders";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/", router, json());
  // Define a GET endpoint on the root route of our custom path

  // ----------------------EndPoinst for product reviws and stars------------------------
  router.get("/products/:id/reviews", wrapHandler(getProductAllReviews));
  router.get("/products/:id/stars", wrapHandler(getStarsProduct));
  //create new review
  router.post(
    "/products/:id/reviews",
    authenticateCustomer(),
    wrapHandler(postProductReviews)
  );

  //update new review
  router.post(
    "/reviews/:id",
    authenticateCustomer(),
    wrapHandler(updateReview)
  );

  router.delete(
    "/reviews/:id",
    authenticateCustomer(),
    wrapHandler(deleteReview)
  );

  // -----------------------------------------------------------------------------

  // ---------------------------------Test Endpoins-------------------------------
  //create a store for customer -- admin
  router.post("/account/seller", wrapHandler(postAccountSeller));
  router.get("/account/orders", wrapHandler(getListCustomerOrders));
  router.post(
    "/account/seller-application",
    documents,
    wrapHandler(postSellerApplication)
  );
  router.post(
    "/account/uptade-seller-application",
    documents,
    wrapHandler(UpdateSellerAplication)
  );

  router.get("/account/seller-application", wrapHandler(getSellerApplication));

  // ---------------------------------Endpoins for List products Variants-------------------------------

  router.get("/list-products-variant", wrapHandler(getListProductsVariant));
  router.get(
    "/list-products-variant-with-sellers",
    wrapHandler(getListProductVariantWithSellers)
  );
  router.get("/products-variant", wrapHandler(getProductVariant));

  //----------------------------------------------------------------------------------------------------

  // -----------------------------------Endpoins for cart --------------------------------

  router.post("/carts/:id/add-item", wrapHandler(postAddItem));
  router.get("/cart/variant-stock", wrapHandler(getCartVariantStock));
  router.post("/carts/:id/checkout", wrapHandler(postCheckout));
  router.get("/cart/items", wrapHandler(getCartItems));
  router.post("/cart/update-item", wrapHandler(updateLine_item));
  router.post("/cart/add-order", wrapHandler(postAddOrder));

  //-----------------------------------Endpoins for Store Order ------------------------------------------

  router.delete("/order/:id/order", wrapHandler(deleteStoreOrder));
}
