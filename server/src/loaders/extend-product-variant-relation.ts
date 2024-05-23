export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/variants/index"
  )) as any;
  imports.defaultRelationsExtended = [
    ...imports.defaultRelationsExtended,
    "store_x_variant",
  ];

  const importsAdmin = (await import(
    "@medusajs/medusa/dist/api/routes/admin/variants/index"
  )) as any;
  importsAdmin.defaultRelationsExtended = [
    ...importsAdmin.defaultRelationsExtended,
    "store_x_variant",
  ];
}
