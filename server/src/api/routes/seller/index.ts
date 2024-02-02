import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { GetSeller } from "./get-seller-store";
import { CreateSellerProduct } from "./post-seller-product";
import { authenticateCustomer } from "@medusajs/medusa";
import { getListSellerProduct } from "./get-seller-product";
import upload from "../../middlewares/uploadThumbnail";

const router = Router();

export function attachSellerRoutes(customerRouter: Router) {
  customerRouter.use("/store", router);
  router.get("/", wrapHandler(GetSeller));

  router.get("/products", wrapHandler(getListSellerProduct));
  router.post(
    "/create-product",
    upload.single("image"),
    authenticateCustomer(),
    wrapHandler(CreateSellerProduct)
  );
}
