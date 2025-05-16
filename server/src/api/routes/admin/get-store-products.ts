import { Router } from "express";
const router = Router();

router.get("/stores/:store_id/products", async (req, res) => {
  const { store_id } = req.params;
  const sellerAdminService = req.scope.resolve("sellerAdminService");
  const products = await sellerAdminService.getProductsByStore(store_id);
  return res.json(products);
});

export default router;