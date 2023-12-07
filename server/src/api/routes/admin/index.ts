import { Router, json } from "express";
import { wrapHandler } from "@medusajs/utils";
import onboardingRoutes from "./onboarding";
import customRouteHandler from "./custom-route-handler";
import { authenticate } from "@medusajs/medusa";
import cors from "cors";
import getListApplication from "./seller/get-seller-application";

// Initialize a custom router
const router = Router();
type adminCorsOptions = {
  origin: string[];
  credentials: boolean;
};
export function attachAdminRoutes(
  adminRouter: Router,
  adminCorsOptions: adminCorsOptions
) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/", router);

  // Define a GET endpoint on the root route of our custom path
  //router.get("/", wrapHandler(customRouteHandler));
  router.options("/sellerapplication", cors(adminCorsOptions), authenticate());
  router.get(
    "/sellerapplication",
    cors(adminCorsOptions),
    authenticate(),
    wrapHandler(getListApplication)
  );

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
