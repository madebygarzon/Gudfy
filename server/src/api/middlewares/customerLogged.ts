import type {
  MiddlewaresConfig,
  Customer,
  CustomerService,
} from "@medusajs/medusa";
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";

const registerLoggedInCustomer = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let loggedInCustomer: Customer | null = null;

  if (req.user && req.user.customer_id) {
    const customerService = req.scope.resolve(
      "customerService"
    ) as CustomerService;
    loggedInCustomer = await customerService.retrieve(req.user.customer_id);
  }

  req.scope.register({
    loggedInCustomer: {
      resolve: () => loggedInCustomer,
    },
  });

  next();
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/seller",
      middlewares: [registerLoggedInCustomer],
    },
  ],
};
