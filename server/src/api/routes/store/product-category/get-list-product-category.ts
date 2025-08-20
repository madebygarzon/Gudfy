import { Request, Response } from "express";

export async function getListProductCategory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    
    const productCategoryService = req.scope.resolve("productCategoryGudfyService");

    const data = await productCategoryService.listProductCategory();

    if (data) {
      res.status(200).send(data);
    }
  } catch (error) { 
    console.log(
      "Error en el punto final para recuperar la lista de categorias ",
      error
    );
  }
}
