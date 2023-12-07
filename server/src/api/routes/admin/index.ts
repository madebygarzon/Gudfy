import { Router, json } from "express";
import { wrapHandler } from "@medusajs/utils";
import onboardingRoutes from "./onboarding";
import customRouteHandler from "./custom-route-handler";

import getListApplication from "./seller/get-seller-application";

// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler));
  router.get("/seller-application", wrapHandler(getListApplication));

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
