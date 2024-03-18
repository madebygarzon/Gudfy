"use client"

import React, { useEffect, useState } from "react"
import { actionGetSellerApplication } from "../actions/action-seller-application"
import { useAccount } from "@lib/context/account-context"
import ApplyForSeller from "../components/dashboard-gf/seller/apply-for-seller"
import { getStore } from "../actions/get-seller-store"
import SellerStore from "../components/dashboard-gf/seller/seller-store"
import Spinner from "@modules/common/icons/spinner"

interface SellerRole {
  application: boolean
  state: string
}
const SupplierTemplate: React.FC = () => {
  const [isloading, setIsloading] = useState<boolean>(true)
  const [isSeller, setIsSeller] = useState<SellerRole>()
  const [store, setStore] = useState()
  const [reset, useReset] = useState(false)

  const functiongetData = async () => {
    const dataSellerApplication = await actionGetSellerApplication().then(
      (data) => {
        setIsSeller(data)
        return data
      }
    )

    if (dataSellerApplication?.state === "approved") {
      const dataStore = await getStore()
      setStore(dataStore)
    }
    setIsloading(false)
  }

  useEffect(() => {
    functiongetData()
  }, [reset])

  const handlerReset = () => {
    setIsloading(true)
    useReset(!reset)
  }

  return isloading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner size="32" />
    </div>
  ) : (
    <>
      {!isSeller?.application && <ApplyForSeller />}
      {isSeller?.state === "approved" &&
        (store ? <SellerStore store={store} /> : <Spinner size="32" />)}
      {isSeller?.state === "pending" && (
        <h1 className="text-[48px]"> Su solicitud esta en proceso </h1>
      )}

      {isSeller?.state === "rejected" && (
        <h1 className="text-[48px]"> Su solicitud fue rechazada </h1>
      )}

      {isSeller?.state === "correct" && (
        <h1 className="text-[48px]"> Su solicitud necesita ser corregida </h1>
      )}
    </>
  )
}

export default SupplierTemplate
