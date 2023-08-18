import {Router} from "express"
import { wrapHandler } from "@medusajs/medusa";
import { recoverPassword } from "./customer-router-handler";

const router = Router();


export function attachCustomerRoutes(customerRouter: Router) {
  
  customerRouter.use("/recover-password", router);

  
  router.get("/", wrapHandler(recoverPassword));
}