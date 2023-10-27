import SupplierTemplate from "@modules/account/templates/supplier-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "supplier",
  description: "Vende tus productos ",
}

export default function Profile() {
  return <SupplierTemplate />
}
