import { getListRequestProduct } from "@modules/account/actions/request-product/get-list-request-product"
import { useMeCustomer } from "medusa-react"
import React, { useEffect, useState } from "react"
import { Modal, ModalContent } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import { useDisclosure } from "@nextui-org/react"
import { ListIcon } from "@lib/util/icons"

type Product = {
  id: string
  customer_id: string
  product_title: string
  product_image: string
  description: string
  variants: string
  approved: boolean
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
        className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
        onClick={onOpen}
      >
        Productos solicitados<ListIcon className="ml-2"/>
      </ButtonLigth>
      <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="p-8 min-h-2/3">
              <h2 className="ml-4 text-2xl mt-2 mb-4 font-bold text-gray-700">
                Mis solicitudes de productos <ListIcon />
              </h2>
              <div className="relative">
                <div className="rounded-lg shadow-2xl px-4 overflow-x-auto overflow-y-auto max-h-96">
                  <table className="min-w-full p-8 bg-white">
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
                          Aprobado
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
                              {product.approved ? "Si" : "No"}
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
