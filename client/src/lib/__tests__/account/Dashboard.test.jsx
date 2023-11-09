import * as React from "react"
import { render, screen , fireEvent } from "@testing-library/react"
import Dashboard from "@modules/account/components/dashboard-gf"

describe("Dashboard Component", () => {
  const customer = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
   
  }

  test("renders the user's name when `customer` prop is provided", () => {
    render(<Dashboard customer={customer} />)
    const userNameElement = screen.getByText("¡Hola John Doe!")
    expect(userNameElement).toBeInTheDocument()
  })

  test("renders the profile completion percentage", () => {
    render(<Dashboard customer={customer} />)
    const profileCompletionElement = screen.getByText("75% completado")
    expect(profileCompletionElement).toBeInTheDocument()
  })
  

  test("renders the button that leads to the edit profile path", () => {
  delete window.location;
  window.location = new URL('http://test.com');
  const { getByRole }= render(<Dashboard customer={customer} />)
  const button = getByRole("link",{name: /Editar perfil/i})
  expect(button).toHaveAttribute("href", "/account/profile");
  })

})

