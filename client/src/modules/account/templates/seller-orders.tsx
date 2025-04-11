"use client"
import React, { useEffect, useState } from "react"
import { Tabs, Tab, Card, CardBody } from "@heroui/react"
import ClaimSellerTable from "../components/order-claim-seller-table"
import SellerOrderTable from "../components/seller-orders-table"
import { useNotificationContext } from "@lib/context/notification-context"
import { SellerOrder, useSellerStoreGudfy } from "@lib/context/seller-store"
import dayjs from "dayjs"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ScatterChart,
  ZAxis,
  Scatter,
} from "recharts"
export type order = {
  id: string
  pay_method_id: string
  created_at: string
  sellerapproved: string
  customerapproved: string
  quantity_products: number
  total_price: string
  person_name: string
  person_last_name: string
  email: string
  conty: string
  city: string
  phone: string
  state_order:
    | "Completado"
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  store_variant: [
    {
      store_id: string
      store_name: string
      store_variant_order_id: string
      produc_title: string
      price: string
      quantity: string
      total_price_for_product: string
    }
  ]
}
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Completado":
      return "#9AC8E8" // azul claro
    case "Cancelada":
      return "#F28B82" // rojo claro
    case "Pagado":
      return "#FDD663" // amarillo claro
    case "Finalizado":
      return "#81C995" // verde claro
    case "En discusión":
      return "#F4B400" // naranja claro
    default:
      return "#D3D3D3" // gris claro
  }
}

const statusNameMap: Record<string, string> = {
  Cancel_ID: "Cancelada",
  Discussion_ID: "En discusión",
  Paid_ID: " Pagado",
  Finished_ID: "Finalizado",
  Completed_ID: "Completado",
}
interface ProductStatus {
  name: string
  value: number
}
interface productTitle {
  name: string
  quantity: number
}
interface BarData {
  date: string
  count: number
}

const SellerOrdersTemplate = () => {
  const { notifications } = useNotificationContext()
  const { listSellerOrders } = useSellerStoreGudfy()
  const [statusOrderMetrics, setStatusOrderMetrics] =
    useState<ProductStatus[]>()
  const [productData, setProductData] = useState<productTitle[]>([])
  const [barData, setBarData] = useState<BarData[]>([])

  const hanlderFunctionOrderProducts = (listSellerOrders: SellerOrder[]) => {
    const productCount: Record<string, number> = {}

    listSellerOrders.forEach((order) => {
      order.products.forEach((product) => {
        if (
          product.variant_order_status_id != "Cancel_ID" &&
          product.variant_order_status_id != "Payment_Pending_ID"
        ) {
          const title = product.produc_title
          if (!productCount[title]) {
            productCount[title] = 0
          }
          productCount[title] += product.quantity
        }
      })
    })
    
    // Convertimos en array para el gráfico
    const processedData = Object.keys(productCount).map((title) => ({
      name: title,
      quantity: productCount[title],
    }))
   
    setProductData(processedData)
  }

  const hanlderHeatmapData = (listSellerOrders: SellerOrder[]) => {
    const today = dayjs()
    const tempData: Record<string, BarData> = {}

    // Inicializar los últimos 30 días con un conteo de 0
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, "day")
      const formattedDate = date.format("YYYY-MM-DD") // Formato para la clave
      tempData[formattedDate] = { date: formattedDate, count: 0 }
    }

    // Contar las órdenes por día
    listSellerOrders.forEach((order) => {
      const orderDate = dayjs(order.created_at).format("YYYY-MM-DD")
      if (tempData[orderDate]) {
        tempData[orderDate].count += 1
      }
    })

    // Convertir el objeto en una lista para Recharts
    const processedData = Object.values(tempData)
    setBarData(processedData)
  }
  const formatXAxis = (tickItem: string) => {
    return dayjs(tickItem).format("DD/MM")
  }
  useEffect(() => {
    if (!listSellerOrders.length) return

    const statusCount: Record<string, number> = {}

    listSellerOrders.forEach((order) => {
      order.products.forEach((product) => {
        const status = product.variant_order_status_id
        if (statusCount[status]) {
          statusCount[status] += product.quantity
        } else {
          statusCount[status] = product.quantity
        }
      })
    })

    const processedData = Object.keys(statusCount).map((status) => {
      const readableStatus = statusNameMap[status] || "Pendiente"
      return {
        name: readableStatus,
        value: statusCount[status],
      }
    })
    hanlderFunctionOrderProducts(listSellerOrders)
    setStatusOrderMetrics(processedData)
    hanlderHeatmapData(listSellerOrders)
  }, [listSellerOrders])
  return (
    <>
      <div className="">
        <div className="w-full p-2 md:p-8 border border-gray-200 rounded-lg shadow-lg mb-4 flex flex-col items-center justify-center">
          <h2 className="text-sm text-center font-semibold text-blue-gf mb-2">
            Ordenes por día
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                labelFormatter={(label) => dayjs(label).format("DD/MM/YYYY")}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex">
          <div className="w-1/2 p-2 md:p-8 border border-gray-200 rounded-lg shadow-lg m-4 flex flex-col items-center justify-center ">
            <h2 className="text-sm text-center font-semibold text-blue-gf mb-2">
              Estado de los productos
            </h2>
            <PieChart width={250} height={260}>
              <Pie
                data={statusOrderMetrics}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusOrderMetrics?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.name)} // Usa el color personalizado
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="w-1/2 p-2 md:p-8 border border-gray-200 rounded-lg shadow-lg m-4 flex flex-col items-center justify-center">
            <h2 className="text-sm text-center font-semibold text-blue-gf mb-2">
              Cantidad x producto vendido
            </h2>
            <ResponsiveContainer width={300} height={300}>
              <BarChart
                data={productData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" name={"Cantidad"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="w-full p-2 md:p-8 border border-gray-200 rounded-lg shadow-lg">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="md:text-xl text-2xl mt-2 font-bold text-gray-700">
            Ordenes de la tienda
          </h1>
        </div>
        <div>
          <div className="flex w-full flex-col">
            <Tabs className="text-lg sm:text-2xl" aria-label="Options">
              <Tab key="Orders" title="Listado de ordenes">
                <Card className="shadow-white shadow-lg">
                  <CardBody>
                    <div className="flex w-full flex-col">
                      <SellerOrderTable />
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="Reclamos"
                title={
                  <div className="relative -m-1">
                    {notifications.map((n) => {
                      if (n.notification_type_id === "NOTI_CLAIM_SELLER_ID") {
                        return (
                          <div
                            key={n.id}
                            className="absolute -top-2 -right-2 flex items-center justify-center"
                          >
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>
                          </div>
                        )
                      }
                    })}
                    <span>Reclamos de ordenes</span>
                  </div>
                }
                className="relative"
              >
                <Card className="shadow-white shadow-lg">
                  <CardBody className="border-none">
                    <ClaimSellerTable />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerOrdersTemplate
