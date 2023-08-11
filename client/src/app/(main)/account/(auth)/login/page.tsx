import React from "react"
import LoginComponente from "@modules/account/components/login"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ACME account.",
}

export default function Login() {
  
  return (
    <div className="grid grid-cols-2 ">
      <div className="flex items-center w-auto h-auto justify-center bg-blue-gf" style={{ height: '100vh' }} >
      <p>Bienvenido</p>
      </div>
      <div className="flex items-center justify-center">
          <LoginComponente/>
      </div>
    </div>
  )
}
