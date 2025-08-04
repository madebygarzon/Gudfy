import { Router, json } from "express";
import { wrapHandler } from "@medusajs/utils";
import onboardingRoutes from "./onboarding";
import { authenticate } from "@medusajs/medusa";
import getListApplication from "./seller/get-seller-application";
import getCommentSellerApplication from "./seller/get-comment-seller-application";
import UpdateSellerAplication from "./seller/update-seller-application";
import updateCommentSellerApplication from "./seller/update-comment-seller-application";
import { registerLoggedInCustomer } from "../../middlewares/customerLogged";
import getListClaimAdmin from "./get-list-claim-admin";
import { getClaimComments } from "./get-claim-comments";
import postAddComments from "./post-add-comments";
import updateClaimStatus from "../store/update-claim-status";
import getClaimNotification from "./get-claim-notification";
import getListStoresToPay from "./get-list-store-to-pay";
import postAddOrderPay from "./post-add-order-pay";
import voucher from "../../middlewares/voucher-order-pay";
import productCategory from "../../middlewares/product-category";
import getListOrderPayments from "./seller/get-list-order-payments";
import getListTickets from "./tickets/get-list-tickets";
import getMessagesTickets from "./tickets/get-data-message-ticket";
import { postAddMessageTicket } from "./tickets/post-add-message-ticket";
import Image from "../../middlewares/images-tickests";
import ImageProduct from "../../middlewares/request-product";

import getSellerList from "./seller/get-seller-list";
import UpdateSellerReview from "./seller/update-seller-review";
import getSellersReviewsList from "./seller/get-seller-reviews-list";
import getAllListRequestProduct from "./request-product/get-all-list-request-product";
import updateRequestProduct from "./request-product/update-request-product";
import { updateTicketStatus } from "./tickets/update-ticket-status";
import getListStoreOrders from "./orders/get-list-store-order";
import getListMetricsCustomer from "./metrics/get-list-metrics-customer";
import getListMetricsSeller from "./metrics/get-list-metrics-seller";
import UpdateOrderToCompleted from "./orders/update-order-to-completed";
import UpdateOrderToPendingToCompleted from "./orders/update-order-pending-to-completed";
import UpdateOrderToCancel from "./orders/update-order-to-cancel";
import storeProducts from "./get-store-products";
import createProductVariant from "./product/create-product-variant";
import createProductVariantWithImage from "./product/create-product-variant-with-image";
import getNotificationDashboardAdmin from "./notification-admin/get-notification-dashboard-admin";
import commissionRoutes from "./commission";
import getProductsWithCommission from "./product/get-product-with-commission";
import updateProductCommission from "./product/update-product-commission";
import addImageToCategory from "./product-category/add-image";
import getListProductCategory from "./product-category/get-list-product-category";

// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/", router, registerLoggedInCustomer);
  router.use(storeProducts);
  //Listado de solicitudes a vendedores
  router.get("/sellerapplication", wrapHandler(getListApplication));

  router.get(
    "/commentsellerapplication",
    wrapHandler(getCommentSellerApplication)
  );

  //Actualizar el estado de la applicacion
  router.post(
    "/sellerapplication",
    authenticate(),
    wrapHandler(UpdateSellerAplication)
  );

  router.post(
    "/commentsellerapplication",
    wrapHandler(updateCommentSellerApplication)
  );

  //------------reclamaciones

  router.get("/list-claim-orders", wrapHandler(getListClaimAdmin));
  router.get("/claim/:id/comment", wrapHandler(getClaimComments));
  router.post("/claim/admin/add-comment", wrapHandler(postAddComments));
  router.post("/claim/update-status", wrapHandler(updateClaimStatus));

  //----------notifications-----------

  router.get("/notification/claim/", wrapHandler(getClaimNotification));

  //----------- payments ----------------
  router.get("/wallet/payments/list-store", wrapHandler(getListStoresToPay));
  router.get(
    "/payments/:id/list-payments-order",
    wrapHandler(getListOrderPayments)
  );
  router.post(
    "/wallet/payments/order-pay",
    voucher.single("voucher"),
    wrapHandler(postAddOrderPay)
  );

  //--------------tickets-------------------
  router.get("/tickets/list-tickets", wrapHandler(getListTickets));
  router.get("/tickets/:id/messages-ticket", wrapHandler(getMessagesTickets));
  router.post(
    "/ticket/add-ticket-message",
    Image.single("image"),
    wrapHandler(postAddMessageTicket)
  );
  router.post("/ticket/update-ticket-status", wrapHandler(updateTicketStatus));

  //------------seller---------

  router.get("/sellers-list", wrapHandler(getSellerList));
  router.get("/sellers-reviews-list", wrapHandler(getSellersReviewsList));
  router.post("/update/seller-review", wrapHandler(UpdateSellerReview));

  //---------request-product----------
  router.get(
    "/all-list-request-product",
    wrapHandler(getAllListRequestProduct)
  );
  router.post("/update-request-product", wrapHandler(updateRequestProduct));

  //---------------orders-------------------
  router.get("/orders/list-orders", wrapHandler(getListStoreOrders));
  router.post(
    "/orders/update-order-to-completed",
    wrapHandler(UpdateOrderToCompleted)
  );
  router.post(
    "/orders/update-order-pending-to-completed",
    wrapHandler(UpdateOrderToPendingToCompleted)
  );
  router.post(
    "/orders/update-order-to-cancel",
    wrapHandler(UpdateOrderToCancel)
  );

  //---------------Metrics-----------------
  router.get(
    "/list-metrics-orders-customer",
    wrapHandler(getListMetricsCustomer)
  );
  router.get("/list-metrics-seller", wrapHandler(getListMetricsSeller));


  //---------------product-----------------
  router.post("/product/create-product-variant", wrapHandler(createProductVariant));

  router.post("/product/create-product-variant-with-image",ImageProduct.single("image"), wrapHandler(createProductVariantWithImage));

  router.get("/product/get-products-with-commission", wrapHandler(getProductsWithCommission));
  router.post("/products/:id/commission", wrapHandler(updateProductCommission));

//---------------Notifications dashboard admin-----------------

router.get("/notification/dashboard-admin", wrapHandler(getNotificationDashboardAdmin));


//------------------product category-------------------------
router.post("/product-category/add-image", productCategory.single("image"), wrapHandler(addImageToCategory));
router.get("/product-category/list-product-category", wrapHandler(getListProductCategory));
commissionRoutes(adminRouter);
onboardingRoutes(adminRouter);
}
