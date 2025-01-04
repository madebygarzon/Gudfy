"use client"

import Dashboard from "@modules/account/components/dashboard-gf"
import { useCustomerOrders, useMeCustomer } from "medusa-react"
import { numberOfCompletedOrders } from "../actions/get-number-of-completed-orders"
import { useEffect, useState } from "react"

const DashboardTemplate = () => {
  const [numberOrders, setNumberOrders] = useState<number>()
  const { customer } = useMeCustomer()

  useEffect(() => {
    numberOfCompletedOrders(customer?.id || "").then((e) => {
      setNumberOrders(e)
    })
  })

  return (
    <div className="sectionAnalisis">
      <Dashboard orders={numberOrders} customer={customer} />
    </div>
  )
}

export default DashboardTemplate
