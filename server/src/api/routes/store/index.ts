import { Router, json } from "express";
import postAccountSeller from "./post-account-seller";
import { wrapHandler } from "@medusajs/utils";
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
import updateCancelStoreOrder from "./update-cancel-store-order";
import { getCurrentOrder } from "./get-current-order";
import deleteCartItem from "./delete-cart-item";
import { getValidateReview } from "./get-validate-review";
import postProductReviews from "./post-store-reviews";
import postClaim from "./post-claim";
import updateFinishedOrder from "./update-finished-order";
import { getListClaim } from "./get-list-claim";
import { getListClaimComments } from "./get-list-claim-comments";
import postAddComment from "./post-add-comment";
import { getListSellerClaim } from "./get-list-seller-claim";
import updateClaimStatus from "./update-claim-status";
import getListProductsInClaim from "./get-list-products-in-claim";
import updateOrderData from "./update-order-data";
import getNotificationRetriver from "./get-notification-retriver";
import updateStateNotification from "./update-state-notification";
import { getListTickets } from "./tickets/get-list-tickets";
import { postAddTickets } from "./tickets/post-add-ticket";
import Image from "../../middlewares/images-tickests";
import { getMessagesTickets } from "./tickets/get-data-messages-ticket";
import binancepay_webhook from "./binancepay_webhook";
import getListSerialCodes from "./serial-codes/get-list-serial-codes";
import deleteCart from "./cart/delete-cart";
import updateReview from "./update-review";
import deleteReview from "./delete-review";
import { getSellerStoreData } from "./seller-store/get-seller-store-data";
import { getSellerStoreReviews } from "./seller-store/get-selller-store-reviews";
import { postAddTicketsMessage } from "./tickets/post-add-ticket-message";
import getNumberOfCompletedOrders from "./get-number-of-completed-orders";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/", router, json());
  // Define a GET endpoint on the root route of our custom path

  // ----------------------EndPoinst for product reviws and stars------------------------
  // router.get("/products/:id/reviews", wrapHandler(getProductAllReviews));
  // router.get("/products/:id/stars", wrapHandler(getStarsProduct));

  router.get(
    "/store-order/:store_order_id/reviews",
    wrapHandler(getValidateReview)
  );
  //create new review
  router.post("/reviews/store-order", wrapHandler(postProductReviews));

  //update new review
  router.post("/reviews/:id", wrapHandler(updateReview));

  router.delete("/reviews/:id", wrapHandler(deleteReview));

  // -----------------------------------------------------------------------------

  // ---------------------------------Test Endpoins-------------------------------
  //create a store for customer -- admin
  router.post("/account/seller", wrapHandler(postAccountSeller));
  router.get("/account/:id/orders", wrapHandler(getListCustomerOrders));
  router.get("/account/:id/current-order", wrapHandler(getCurrentOrder));
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
  router.get(
    "/account/number-completed-orders/:id",
    wrapHandler(getNumberOfCompletedOrders)
  );

  // ---------------------------------Endpoins for List products Variants-------------------------------

  router.get("/list-products-variant", wrapHandler(getListProductsVariant));
  router.get(
    "/list-products-variant-with-sellers",
    wrapHandler(getListProductVariantWithSellers)
  );
  router.get("/products-variant", wrapHandler(getProductVariant));

  //----------------------------------------------------------------------------------------------------

  // -----------------------------------Endpoins for cart --------------------------------
  router.delete(
    "/cart/:id_cart/delete-item/:id_item",
    wrapHandler(deleteCartItem)
  );
  router.delete("/cart/:id_cart/delete-cart/", wrapHandler(deleteCart));
  router.post("/carts/:id/add-item", wrapHandler(postAddItem));
  router.get("/cart/variant-stock", wrapHandler(getCartVariantStock));
  router.post("/carts/:id/checkout", wrapHandler(postCheckout));
  router.get("/cart/items", wrapHandler(getCartItems));
  router.post("/cart/update-item", wrapHandler(updateLine_item));
  router.post("/cart/add-order", wrapHandler(postAddOrder));

  //-----------------------------------Endpoins for Store Order ------------------------------------------
  router.post("/order/:id/cancel-order", wrapHandler(updateCancelStoreOrder));
  router.delete("/order/:id/order", wrapHandler(deleteStoreOrder));
  router.post("/order/:id/finished-order", wrapHandler(updateFinishedOrder));
  router.post("/order/uptade-data", wrapHandler(updateOrderData));

  //-----------------------------------Endpoins for Order Claim ------------------------------------------
  router.get("/claim/:id/orders", wrapHandler(getListClaim));
  router.get("/claim/:id/seller/orders", wrapHandler(getListSellerClaim));
  router.get(
    "/claim/:id/order/list-products-in-claim",
    wrapHandler(getListProductsInClaim)
  );
  router.get("/claim/:id/comment", wrapHandler(getListClaimComments));
  router.post("/claim", wrapHandler(postClaim));
  router.post("/claim/customer/add-comment", wrapHandler(postAddComment));
  router.post("/claim/update-status", wrapHandler(updateClaimStatus));

  //----------------------------------Notifications------------------------------

  router.get("/notification/:id", wrapHandler(getNotificationRetriver));
  router.post(
    "/notification/:id/update/:status",
    wrapHandler(updateStateNotification)
  );

  //--------------------------------Tickets--------------------------------------
  router.get("/account/list-tickets", wrapHandler(getListTickets));
  router.get("/account/:id/messages-ticket", wrapHandler(getMessagesTickets));
  router.post(
    "/account/add-ticket",
    Image.single("image"),
    wrapHandler(postAddTickets)
  );
  router.post(
    "/account/add-ticket-message",
    Image.single("image"),
    wrapHandler(postAddTicketsMessage)
  );

  //-------------------------------webhoock-----------------------------

  router.post(
    "/binance_pay/webhook/:id/order",
    wrapHandler(binancepay_webhook)
  );

  //-----------------------------serialCodes---------------------------
  router.get("/account/list-serial-codes", wrapHandler(getListSerialCodes));

  //-------------------------seller stores----------------------------
  router.get("/seller-store/:id", wrapHandler(getSellerStoreData));
  router.get("/seller-store-reviews", wrapHandler(getSellerStoreReviews));
}
