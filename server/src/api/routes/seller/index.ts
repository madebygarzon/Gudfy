import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { GetSeller } from "./get-seller-store";
import { CreateSellerProduct } from "./post-seller-product";
import { authenticateCustomer } from "@medusajs/medusa";
import { getListSellerProduct } from "./get-seller-product";

const router = Router();

export function attachSellerRoutes(customerRouter: Router) {
  customerRouter.use("/store", router);
  router.get("/", wrapHandler(GetSeller));

  router.get("/products", wrapHandler(getListSellerProduct));
  router.post(
    "/create-product",
    authenticateCustomer(),
    wrapHandler(CreateSellerProduct)
  );
}
