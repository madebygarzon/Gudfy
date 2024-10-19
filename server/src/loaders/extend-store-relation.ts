export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/index"
  )) as any;
  imports.defaultRelationsExtended = [
    ...imports.defaultRelationsExtended,
    "members",
    "store_x_variant",
    "wallet",
  ];

  const importsAdmin = (await import(
    "@medusajs/medusa/dist/api/routes/admin/index"
  )) as any;
  importsAdmin.defaultRelationsExtended = [
    ...importsAdmin.defaultRelationsExtended,
    "members",
    "store_x_variant",
    "wallet",
  ];
}
