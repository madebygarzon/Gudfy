import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { GetSeller } from "./get-seller-store";
import { CreateSellerProduct } from "./post-seller-product";
import { authenticateCustomer } from "@medusajs/medusa";
import { getListSellerProduct } from "./get-seller-product";
import upload from "../../middlewares/uploadThumbnail";
import { deleteVariant } from "./delete-seller-variant";
import { updateProduct } from "./update-seller-product";
import { postAddProductVariant } from "./post-add-product-variant";
import { getListStoreProductVariant } from "./get-list-store-products-variants";
import { getStoreProductVarian } from "./get-store-product-variant";
import { getListSellerOrders } from "./get-list-seller-orders";
import { waitForDebugger } from "inspector";
import { getWallet } from "./get-wallet";
import { getListSellerPayOrders } from "./get-list-seller-pay-orders";
import { getListOrderPayments } from "./get-list-order-payments";

const router = Router();

export function attachSellerRoutes(customerRouter: Router) {
  customerRouter.use("/store", router);
  router.get("/", wrapHandler(GetSeller));
  router.get("/products-variants", wrapHandler(getListSellerProduct));
  router.post("/add-product-variant", wrapHandler(postAddProductVariant));
  router.get(
    "/store-products-variants",
    wrapHandler(getListStoreProductVariant)
  );

  //-------Endpoints seller dashboard-------------------------------
  //------Orders---------
  router.get("/account/:id/orders", wrapHandler(getListSellerOrders));
  router.get("/:id/orders/payments", wrapHandler(getListOrderPayments));

  //----wallet----
  router.get("/wallet", wrapHandler(getWallet));
  router.get("/wallet/orders", wrapHandler(getListSellerPayOrders));
}
