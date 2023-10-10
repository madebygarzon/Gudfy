import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import { Customer } from "./customer-router-handler";
const router = Router();

export function attachCustomerRoutes(customerRouter: Router) {
  customerRouter.use("/user", router);
  router.get("/", wrapHandler(Customer));
}
