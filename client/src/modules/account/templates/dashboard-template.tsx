"use client"

import Dashboard from "@modules/account/components/dashboard-gf"
import { useCustomerOrders, useMeCustomer } from "medusa-react"

const DashboardTemplate = () => {
  const { orders } = useCustomerOrders()
  const { customer } = useMeCustomer()

  return <div className="sectionAnalisis">
            <Dashboard orders={orders} customer={customer} />
          </div>
}

export default DashboardTemplate
