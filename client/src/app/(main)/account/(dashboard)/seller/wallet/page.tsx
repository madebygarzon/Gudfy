import WalletTemplate from "@modules/account/templates/wallet-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Billetera",
  description: "Gestiona tu dinero",
}

export default function Orders() {
  return <WalletTemplate />
}
