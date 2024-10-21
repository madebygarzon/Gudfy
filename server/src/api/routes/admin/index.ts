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
import getListOrderPayments from "./seller/get-list-order-payments";

// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/", router, registerLoggedInCustomer);

  // Define a GET endpoint on the root route of our custom path

  //router.get("/", wrapHandler(customRouteHandler));

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

  //reclamaciones

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
  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
