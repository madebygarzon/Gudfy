import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { Customer } from "./customer-router-handler";
import getCustomer from "./get-customer-store";

const router = Router();

export function attachCustomerRoutes(customerRouter: Router) {
  customerRouter.use("/store", router);
  router.get("/", wrapHandler(getCustomer));
}
