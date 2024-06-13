export default async function () {
  // Para las rutas de la tienda
  const LineItemImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/carts/create-line-item/index"
  )) as any;
  LineItemImports.allowedStoreCustomersFields = [
    ...LineItemImports.allowedStoreCustomersFields,
    "store_id",
  ];
  LineItemImports.defaultStoreCustomersFields = [
    ...LineItemImports.defaultStoreCustomersFields,
    "store_id",
  ];

  // Para las rutas del administrador
  const adminLineItemImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/carts/create-line-item/index"
  )) as any;
  adminLineItemImports.allowedAdminCustomersFields = [
    ...adminLineItemImports.allowedAdminCustomersFields,
    "store_id",
  ];
  adminLineItemImports.defaultAdminCustomersFields = [
    ...adminLineItemImports.defaultAdminCustomersFields,
    "store_id",
  ];
}
