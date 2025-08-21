export default async function () {
    // Para las rutas de la tienda
    const storeImports = (await import(
      "@medusajs/medusa/dist/api/routes/store/product-categories/index"
    )) as any;
    storeImports.allowedStoreProductCategoriesFields = [
      ...storeImports.allowedStoreProductCategoriesFields,
      "image_url",
    ];
    storeImports.defaultStoreProductCategoriesFields = [
      ...storeImports.defaultStoreProductCategoriesFields,
      "image_url",
    ];
  
    // Para las rutas del administrador
    const adminImports = (await import(
      "@medusajs/medusa/dist/api/routes/admin/product-categories/index"
    )) as any;
    adminImports.allowedAdminProductCategoriesFields = [
      ...adminImports.allowedAdminProductCategoriesFields,
      "image_url",
    ];
    adminImports.defaultAdminProductCategoriesFields = [
      ...adminImports.defaultAdminProductCategoriesFields,
      "image_url",
    ];
  }
  