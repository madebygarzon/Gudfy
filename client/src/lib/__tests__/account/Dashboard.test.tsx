import * as React from "react"
import { render, screen } from "@testing-library/react"
import Dashboard from "@modules/account/components/dashboard-gf"
import { Customer, Order } from "@medusajs/medusa"

test("render user data (customer)", () => {
  const orders: Order[] = []
  const customer: Omit<
    Customer,
    | "password_hash"
    | "created_at"
    | "updated_at"
    | "metadata"
    | "billing_address"
    | "billing_address_id"
    | "shipping_addresses"
  > = {
    email: "ronalldocorrea@gmail.com",
    first_name: "ronaldo",
    last_name: "delgado",
    phone: "",
    has_account: true,
    orders: [],
    groups: [],
    deleted_at: null,
    id: "",
  }

  render(<Dashboard orders={orders} customer={customer} />)
})
