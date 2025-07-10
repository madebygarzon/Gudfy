export default async function () {
    // Para las rutas de la tienda
    const storeImports = (await import(
      "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any;
    storeImports.allowedStoreProductsFields = [
      ...storeImports.allowedStoreProductsFields,
      "product_comission_id",
    ];
    storeImports.defaultStoreProductsFields = [
      ...storeImports.defaultStoreProductsFields,
      "product_comission_id",
    ];
  
    // Para las rutas del administrador
    const adminImports = (await import(
      "@medusajs/medusa/dist/api/routes/admin/products/index"
    )) as any;
    adminImports.allowedAdminProductsFields = [
      ...adminImports.allowedAdminProductsFields,
      "product_comission_id",
    ];
    adminImports.defaultAdminProductsFields = [
      ...adminImports.defaultAdminProductsFields,
      "product_comission_id",
    ];
  }
  