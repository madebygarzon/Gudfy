"use client"

import React, { useEffect, useState } from "react"
import { actionGetSellerApplication } from "../actions/action-seller-application"
import { useAccount } from "@lib/context/account-context"
import ApplyForSeller from "../components/dashboard-gf/seller/apply-for-seller"
import PendingRequest from "../components/dashboard-gf/seller/pending-request"
import { getStore } from "../actions/get-seller-store"
import SellerStore from "../components/dashboard-gf/seller/seller-store"
import Spinner from "@modules/common/icons/spinner"
import CorrectionApplication from "../components/dashboard-gf/seller/correction_of_the_application"
import type { SellerCredentials } from "types/global"

interface SellerRole {
  application: boolean
  state: string
  comment: string
  application_data: SellerCredentials & { id: string }
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
      {!isSeller?.application && <ApplyForSeller handlerReset={handlerReset} />}
      {isSeller?.state === "aprobada" &&
        (store ? <SellerStore store={store} /> : <Spinner size="32" />)}
      {isSeller?.state === "pendiente" ||
        (isSeller?.state === "corregido" && <PendingRequest />)}
      {isSeller?.state === "rechazado" && (
        <h1 className="text-[48px]"> Su solicitud fue rechazada </h1>
      )}

      {isSeller?.state === "correccion" && (
        <>
          <CorrectionApplication
            handlerReset={handlerReset}
            data={isSeller.application_data}
            comment={isSeller.comment}
          />
        </>
      )}
    </>
  )
}

export default SupplierTemplate
