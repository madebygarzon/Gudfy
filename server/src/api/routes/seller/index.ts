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
import { postAddCodesStoreVariant } from "./post-add-codes-store-variant";
import getDataReviews from "./get-data-reviews";
import getStoreReviews from "./get-store-reviews";
import { updateNameStore } from "./update-name-store";
import { updateSellerAvatar } from "./update-seller-avatar";
import { addRequestProduct } from "./request-product/post-request-product";
import { getListRequestProduct } from "./request-product/get-list-request-product-from-seller";
import { getListProductSerials } from "./product/get-list-product-serial";
import { DeleteSerialCodes } from "./product/delete-serials-code";
import { getListSoldProductSerials } from "./product/get-list-sold-product-serial";
import { postUpdatePriceProduct } from "./product/update-product-price";
import requestPayment from "./wallet/request-payment";
import updateWallet from "./wallet/update-wallet";

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
  router.get("/request-payment", wrapHandler(requestPayment));
  router.post("/update-wallet", wrapHandler(updateWallet));

  //-------Product - Serial-codes--------

  router.post(
    "/add-codes-store-variant",
    wrapHandler(postAddCodesStoreVariant)
  );
  router.post("/update-product-price", wrapHandler(postUpdatePriceProduct));
  router.get(
    "/get-list-product-serials/:id",
    wrapHandler(getListProductSerials)
  );
  router.get(
    "/get-list-sold-product-serials/:id",
    wrapHandler(getListSoldProductSerials)
  );
  router.delete("/delelte-serial-codes", wrapHandler(DeleteSerialCodes));

  //-------reviews---------------
  router.get("/data-reviews", wrapHandler(getDataReviews));
  router.get("/reviews", wrapHandler(getStoreReviews));

  //----Store--------------
  router.post("/edit-name-store", wrapHandler(updateNameStore));
  router.post("/edit-seller-avatar", wrapHandler(updateSellerAvatar));

  //-----request-product---------------------------
  router.post(
    "/create-request-product",
    upload.single("image"),
    authenticateCustomer(),
    wrapHandler(addRequestProduct)
  );
  router.get("/LIST-request-product/:id", wrapHandler(getListRequestProduct));
}
