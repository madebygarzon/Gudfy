import { Request, Response } from "express";

export async function getListProductVariantCategory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { limit, offset, category_id } = req.query;

    const productService = req.scope.resolve("productVariantCategoryService");

    const list = await productService.listVariantsCategory(
      limit,
      offset,
      category_id
    );

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para la lista de las variciones por categoria ",
      error
    );
  }
}
