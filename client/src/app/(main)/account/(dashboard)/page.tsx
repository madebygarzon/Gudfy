//import OverviewTemplate from "@modules/account/templates/overview-template"
import DashboardTemplate from "@modules/account/templates/dashboard-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account",
  description: "Ingresa a tu Dashboard",
}

export default function Account() {
  // return <OverviewTemplate />
  return <DashboardTemplate />
}
