export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/index"
  )) as any;
  imports.defaultRelationsExtended = [
    ...imports.defaultRelationsExtended,
    "members",
    "products",
  ];
}
