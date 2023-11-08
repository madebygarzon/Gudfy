import * as React from "react"
import { render, screen } from "@testing-library/react"
import Dashboard from "@modules/account/components/dashboard-gf"
import { Customer, Order } from "@medusajs/medusa"
import "@testing-library/jest-dom"

describe("Dashboard Component", () => {
  test("renders the user's name when `customer` prop is provided", () => {
    const customer: Omit<Customer, "password_hash" | "billing_address"> = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      orders: [],
      has_account: false,
      groups: [],
      deleted_at: null,
      id: "",
      billing_address_id: null,
      shipping_addresses: [],
      metadata: {},
      created_at: new Date(),
      updated_at: new Date(),
    }
    render(<Dashboard customer={customer} />)

    const userNameElement = screen.getByText("¡Hola John Doe!")

    expect(userNameElement).toBeInTheDocument()
  })

  test("renders the profile completion percentage", () => {
    const customer: Omit<Customer, "password_hash" | "billing_address"> = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      orders: [],
      has_account: false,
      groups: [],
      deleted_at: null,
      id: "",
      billing_address_id: null,
      shipping_addresses: [],
      metadata: {},
      created_at: new Date(),
      updated_at: new Date(),
    }
    render(<Dashboard customer={customer} />)

    const profileCompletionElement = screen.getByText("75% completado")

    expect(profileCompletionElement).toBeInTheDocument()
  })
})
