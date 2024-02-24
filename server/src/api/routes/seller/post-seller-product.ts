import { Request, Response } from "express";

export async function CreateSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productData = JSON.parse(req.body.productData);
    const imagenPath = req.file.path;

    const productService = req.scope.resolve("productService");
    const dataProduct = {
      title: productData.product.title,
      is_giftcard: false,
      discountable: true,
      options: productData.optionVariant.map((option) => ({
        title: option.titleOption,
      })),
      variants: productData.variant.map((v) => ({
        title: variantTitle(v.typeOpcionVariant),
        prices: [
          {
            amount: v.prices * 100,
            currency_code: "usd",
          },
        ],
        options: v.typeOpcionVariant.map((vop) => ({
          value: vop.titleOption,
        })),
        inventory_quantity: v.inventory_quantity,
      })),
      categories: productData.categories.map((c) => ({ id: c.id })),
    };

    const product = await productService.createProductStoreCustomer(
      dataProduct,
      imagenPath
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
//funsion para crear el titulo de la variante segun sus opciones
function variantTitle(arrayObjetos) {
  if (Array.isArray(arrayObjetos) && arrayObjetos.length > 0) {
    // Utilizamos el método map para extraer las propiedades 'title'
    const palabras = arrayObjetos.map((objeto) => objeto.titleValueVariant);
    // Utilizamos el método join para unir las palabras con " / "
    return palabras.join(" / ");
  } else {
    // Si el array está vacío o no es un array, simplemente devolvemos una cadena vacía
    return "";
  }
}
