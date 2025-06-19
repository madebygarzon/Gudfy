import { getListRequestProduct } from "@modules/account/actions/request-product/get-list-request-product"
import { useMeCustomer } from "medusa-react"
import React, { useEffect, useState } from "react"
import { Modal, ModalContent } from "@heroui/react"
import ButtonLigth from "@modules/common/components/button_light"
import { useDisclosure } from "@heroui/react"
import { ListIcon } from "@lib/util/icons"

type Product = {
  id: string
  customer_id: string
  product_title: string
  product_image: string
  description: string
  variants: string
  approved?: boolean // deprecated
  status: "C" | "B" | "A"
  note?: string
  created_at: string
}

const RequestProductTable: React.FC = () => {
  const { customer } = useMeCustomer()
  const [reqPro, setReqPro] = useState<Product[]>()

  useEffect(() => {
    getListRequestProduct(customer?.id || " ").then((e) => {
      setReqPro(e)
    })
  }, [])

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <ButtonLigth
        className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none md:px-12 px-[10px]"
        onClick={onOpen}
      >
        Productos solicitados
        <ListIcon className="ml-2" />
      </ButtonLigth>
      <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="md:p-8 p-4 min-h-[400px]">
              <h2 className="ml-4 md:text-2xl text-lg md:text-start text-center mt-2 mb-4 font-bold text-gray-700">
                Mis solicitudes de productos <ListIcon />
              </h2>
              <div className="relative  ">
                <div className="rounded-lg shadow-2xl px-4 overflow-x-auto overflow-y-auto max-h-96 ">
                  <table className="min-w-full md:p-8 p-2 bg-white min-h-[100px] md:text-base text-xs">
                    <thead className="sticky top-0 bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Producto
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Imagen
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Descripción
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Variaciones
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Estado
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Nota
                        </th>
                        <th className="px-4 py-2 border-b border-gray-100 text-left">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reqPro
                        ?.sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-100">
                              {product.product_title}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              <img
                                src={product.product_image}
                                alt={product.product_title}
                                className="w-12 h-12 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              {product.description}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              {product.variants}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              <span
                                className={
                                  product.status === "A"
                                    ? "text-green-600"
                                    : product.status === "B"
                                    ? "text-red-600"
                                    : "text-yellow-500"
                                }
                              >
                                {product.status === "A"
                                  ? "Aprobado"
                                  : product.status === "B"
                                  ? "Rechazado"
                                  : "Pendiente"}
                              </span>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              {product.note || "-"}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-100">
                              {new Date(
                                product.created_at
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestProductTable
