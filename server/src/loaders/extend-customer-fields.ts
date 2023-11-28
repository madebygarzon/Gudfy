export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/customers/index"
  )) as any;
  imports.allowedAdminUsersFields = [
    ...imports.allowedAdminUsersFields,
    "store_id",
    ,
  ];
  imports.defaultAdminUsersFields = [
    ...imports.defaultAdminUsersFields,
    "store_id",
    ,
  ];
}
