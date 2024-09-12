import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productsVariants = req.scope.resolve("orderClaimService");
    const listPC = await productsVariants.listProductsInClaim(id);
    res.status(200).send(listPC);
  } catch (error) {
    console.log(
      "Error al obtener la lista de productos que estan en reclamacion:",
      error
    );
  }
};
