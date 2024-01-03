import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { GetSeller } from "./get-seller-store";
import { CreateSellerProduct } from "./post-seller-store";
import { authenticateCustomer } from "@medusajs/medusa";

const router = Router();

export function attachCustomerRoutes(customerRouter: Router) {
  customerRouter.use("/store", router);
  router.get("/", wrapHandler(GetSeller));
  router.post(
    "/create-product",
    authenticateCustomer(),
    wrapHandler(CreateSellerProduct)
  );
}
