import { Request, Response } from "express";

export async function getListClaim(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const order_claim = req.scope.resolve("orderClaimService");
    
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const searchTerm = search as string || '';
    
    const list = await order_claim.retriveListClaimCustomer(
      id, 
      pageNumber, 
      limitNumber, 
      searchTerm
    );

    if (list) {
      res.status(200).send(list);
    } else {
      res.status(404).send({ message: "No se encontraron reclamaciones" });
    }
  } catch (error) {
    console.error(
      "Error en el punto final para la lista de las ordenes de reclamacion",
      error
    );
    res.status(500).send({ message: "Error al obtener las reclamaciones", error: error.message });
  }
}
