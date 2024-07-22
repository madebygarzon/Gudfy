import TicketsTemplate from "@modules/account/templates/list-tickets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mis Tickets",
  description: "Mi listado de tickets"
}

export default function Tickets() {
  return <TicketsTemplate />
}
