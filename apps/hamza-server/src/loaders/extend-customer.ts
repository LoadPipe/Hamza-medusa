// https://docs.medusajs.com/development/loaders/create

/*
import { allowedStoreCustomersFields } from "@medusajs/medusa/dist/api/routes/store/customers";

export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/customers/index"
  )) as any;
  imports.allowedStoreCustomersFields = [
    ...imports.allowedStoreCustomersFields,
    "customAttribute",
  ];
  imports.defaultStoreCustomersFields = [
    ...imports.defaultStoreCustomersFields,
    "customAttribute",
  ];
}
*/