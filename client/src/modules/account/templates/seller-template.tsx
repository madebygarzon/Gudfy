"use client"

import React, { useEffect, useState } from "react"
import { actionGetSellerApplication } from "../actions/action-seller-application"
import { useAccount } from "@lib/context/account-context"
import ApplyForSeller from "../components/dashboard-gf/seller/apply-for-seller"

interface SellerRole {
  application: boolean
  approved: boolean
  rejected: boolean
}
const SupplierTemplate: React.FC = () => {
  const { customer } = useAccount()
  const [isSeller, setIsSeller] = useState<SellerRole>()
  const [reset, useReset] = useState(false)

  useEffect(() => {
    if (customer!) {
      actionGetSellerApplication(customer.id).then((data) => setIsSeller(data))
    }
  }, [reset])

  const handlerReset = () => {
    useReset(!reset)
  }

  return !isSeller?.application && customer ? (
    <>
      <ApplyForSeller customer_id={customer.id} handlerReset={handlerReset} />
    </>
  ) : !isSeller?.approved ? (
    !isSeller?.rejected ? (
      <h1 className="text-[48px]"> Su solicitud esta en proceso </h1>
    ) : (
      <h1 className="text-[48px]"> Su solicitud fue rechazada </h1>
    )
  ) : (
    <h1 className="text-[48px]"> Eres vendedor</h1>
  )
}

export default SupplierTemplate
