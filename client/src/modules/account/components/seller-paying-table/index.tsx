"use client"

import { useState, useEffect } from "react"
import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"

import { FaEye } from "react-icons/fa6"

import { Button as ButtonMedusa } from "@medusajs/ui"

import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import handlerformatDate from "@lib/util/formatDate"

export type fakeData = {
  id: string
  fecha: string
  Monto: number
}
const fakeDataArray: fakeData[] = [
  {
    id: "PA19184701",
    fecha: "2023-09-21T14:48:00.000Z",
    Monto: parseFloat((Math.random() * 1000).toFixed(2)),
  },
  {
    id: "PA19184699",
    fecha: "2023-09-22T11:25:00.000Z",
    Monto: parseFloat((Math.random() * 1000).toFixed(2)),
  },
  {
    id: "PA19984612",
    fecha: "2023-09-23T09:15:00.000Z",
    Monto: parseFloat((Math.random() * 1000).toFixed(2)),
  },
  {
    id: "PA19184601",
    fecha: "2023-09-24T16:30:00.000Z",
    Monto: parseFloat((Math.random() * 1000).toFixed(2)),
  },
  {
    id: "PA19184506",
    fecha: "2023-09-25T08:45:00.000Z",
    Monto: parseFloat((Math.random() * 1000).toFixed(2)),
  },
]

const WalletTable: React.FC = () => {
  const [listSellerOrders, setList] = useState(fakeDataArray)
  const handleReset = () => {
    // handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    "Pendiente" | "Pagado" | "Cancelado" | "all"
  >("all")
  const [selectOrderData, setSelectOrderData] = useState<fakeData>()

  // const filteredOrder =
  //   filterStatus === "all"
  //     ? listSellerOrders
  //     : listSellerOrders?.filter((order) => order.estado === filterStatus)

  const getStatusColor = (
    status: "Pendiente" | "Pagado" | "Cancelado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Pendiente":
        return "bg-yellow-200"
      case "Pagado":
        return "font-Abndsab blod"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }

  useEffect(() => {}, [])

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4 ">
        <h1 className="text-2xl-semi">Historico de transacciones</h1>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4">
          <div className="flex w-auto gap-7 mr-4 font-bold">
            <div>
              Saldo Pendiente:{" "}
              <span className="text-yellow-600  text-lg">1,203.45 $</span>
            </div>
            <div>
              Saldo Disponible:{" "}
              <span className="text-green-600 text-lg">1,495.45 $</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2  bg-gray-100 text-left">Fecha</th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Numero de Pago
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Monto Pagado
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Detalle del pago
                </th>
              </tr>
            </thead>
            <tbody>
              {true ? (
                fakeDataArray?.map((order) => (
                  <tr key={order.fecha} className="hover:bg-gray-50">
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.fecha)}
                    </td>
                    <td className="px-4 py-2 ">{order.id}</td>
                    <td className="px-4 py-2 text-green-600 ">
                      {" "}
                      $ {order.Monto}
                    </td>
                    <td className="px-4 py-2  ">
                      <ButtonMedusa
                        className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72] "
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      >
                        <FaEye />
                        Ver detalle del pago
                      </ButtonMedusa>
                    </td>
                  </tr>
                ))
              ) : (
                <>Cargando...</>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalOrder
        orderData={selectOrderData}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

type Product = {
  id: string
  nombre: string
  pedido: string
  cliente: string
  cantidad: number
  valor: number
}
interface ModalOrder {
  orderData?: fakeData
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

// Información falsa para el modal
const fakeProducts: Product[] = [
  {
    id: "p12343753",
    nombre: "Netflix",
    pedido: "ORD1001",
    cliente: "Ana García",
    cantidad: 1,
    valor: 12.99,
  },
  {
    id: "p2345321",
    nombre: "Spotify",
    pedido: "ORD1002",
    cliente: "Juan Pérez",
    cantidad: 2,
    valor: 24.99,
  },
  {
    id: "p13424103",
    nombre: "Free Fire",
    pedido: "ORD1003",
    cliente: "Luis Martínez",
    cantidad: 1,
    valor: 9.99,
  },
]

const ModalOrder = ({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalOrder) => {
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {
      onOpenChange()
      handleReset()
    })
  }

  const subtotal = fakeProducts.reduce(
    (acc, product) => acc + product.valor * product.cantidad,
    0
  )
  const totalComision = fakeProducts.reduce(
    (acc, product) => acc + product.valor * product.cantidad * 0.1,
    0
  )
  const totalFinal = subtotal - totalComision

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent className="bg-white p-6 rounded-lg shadow-lg">
        <ModalHeader className="text-2xl font-bold text-center mb-4">
          Recibo de Orden
        </ModalHeader>

        <ModalBody>
          {/* Lista de productos */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b">Producto</th>
                <th className="p-2 border-b">N° Pedido</th>
                <th className="p-2 border-b">Cliente</th>
                <th className="p-2 border-b text-right">Cantidad</th>
                <th className="p-2 border-b text-right">Valor Unitario</th>
                <th className="p-2 border-b text-right">Comisión (10%)</th>
                <th className="p-2 border-b text-right">Total Producto</th>
              </tr>
            </thead>
            <tbody>
              {fakeProducts.map((product) => {
                const totalProducto = product.valor * product.cantidad
                const comision = totalProducto * 0.1
                return (
                  <tr key={product.id}>
                    <td className="p-2 border-b">{product.nombre}</td>
                    <td className="p-2 border-b">{product.pedido}</td>
                    <td className="p-2 border-b">{product.cliente}</td>
                    <td className="p-2 border-b text-right">
                      {product.cantidad}
                    </td>
                    <td className="p-2 border-b text-right">
                      ${product.valor.toFixed(2)}
                    </td>
                    <td className="p-2 border-b text-right">
                      ${comision.toFixed(2)}
                    </td>
                    <td className="p-2 border-b text-right">
                      ${totalProducto.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Resumen */}
          <div className="mt-6">
            <div className="flex justify-between font-semibold text-lg">
              <div>Subtotal:</div>
              <div>${subtotal.toFixed(2)}</div>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <div>Total Comisión:</div>
              <div>${totalComision.toFixed(2)}</div>
            </div>
            <div className="flex justify-between font-semibold text-xl mt-4">
              <div>Total Final:</div>
              <div>${totalFinal.toFixed(2)}</div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end mt-6">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={() => alert("Ver comprobante")}
          >
            Ver Comprobante
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WalletTable
