export default async function () {
    const imports = (await import(
      "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any;
    imports.defaultRelationsExtended = [
      ...imports.defaultRelationsExtended,
      "product_comission",
    ];
  
    const importsAdmin = (await import(
      "@medusajs/medusa/dist/api/routes/admin/products/index"
    )) as any;
    importsAdmin.defaultRelationsExtended = [
      ...importsAdmin.defaultRelationsExtended,
      "product_comission",
    ];
  }
  