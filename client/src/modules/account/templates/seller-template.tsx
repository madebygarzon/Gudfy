"use client"
import React, { useEffect, useState } from "react"
import { actionGetSellerApplication } from "../actions/action-seller-application"
import { useAccount } from "@lib/context/account-context"
import ApplyForSeller from "../components/dashboard-gf/seller/apply-for-seller"
import PendingRequest from "../components/dashboard-gf/seller/pending-request"
import { getStore } from "../actions/get-seller-store"
import SellerStore from "../components/dashboard-gf/seller/seller-store"
import Spinner from "@modules/common/icons/spinner"
import CorrectionApplication from "../components/dashboard-gf/seller/correction-request"
import RejectedApplication from "../components/dashboard-gf/seller/rejected-request"
import type { SellerCredentials } from "types/global"
import { Store } from "@medusajs/medusa"
import { useSellerStoreGudfy } from "@lib/context/seller-store"

interface SellerRole {
  application: boolean
  state: string
  comment: string
  application_data: SellerCredentials & { id: string }
}

type store = {
  id: string
  name: string
}
const SupplierTemplate: React.FC = () => {
  const [isloading, setIsloading] = useState<boolean>(true)
  const [isSeller, setIsSeller] = useState<SellerRole>()

  const [reset, useReset] = useState(false)
  const { storeSeller, handlerGetSellerStore } = useSellerStoreGudfy()

  const functiongetData = async () => {
    const dataSellerApplication = await actionGetSellerApplication().then(
      (data) => {
        setIsSeller(data)
        return data
      }
    )

    if (dataSellerApplication?.state === "aprobada") {
      await handlerGetSellerStore()
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
        (storeSeller ? (
          <SellerStore id={storeSeller.id} name={storeSeller.name} />
        ) : (
          <Spinner size="32" />
        ))}
      {(isSeller?.state === "pendiente" || isSeller?.state === "corregido") && (
        <PendingRequest />
      )}
      {isSeller?.state === "rechazado" && (
        <RejectedApplication comment={isSeller.comment} />
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
