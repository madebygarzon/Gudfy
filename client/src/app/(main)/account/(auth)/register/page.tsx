import React from "react"
import Register from "@modules/account/components/register"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ACME account.",
}

export default function RegisterPages() {
  return <Register />
}
