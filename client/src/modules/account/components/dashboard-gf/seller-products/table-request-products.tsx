import { getListRequestProduct } from "@modules/account/actions/request-product/get-list-request-product"
import { useMeCustomer } from "medusa-react"
import React, { useEffect, useState } from "react"

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
  return (
    <div className="overflow-y-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {/* <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Customer ID</th> */}
            <th className="px-4 py-2 border-b border-gray-300 text-left">Producto</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Imagen</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Descripción</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Variaciones</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Aprobado</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody className="">
          {reqPro?.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100">
              {/* <td className="px-4 py-2 border-b">{product.id}</td>
              <td className="px-4 py-2 border-b">{product.customer_id}</td> */}
              <td className="px-4 py-2 border-b border-gray-300">{product.product_title}</td>
              <td className="px-4 py-2 border-b border-gray-300">
                <img
                  src={product.product_image}
                  alt={product.product_title}
                  className="w-12 h-12 rounded"
                />
              </td>
              <td className="px-4 py-2 border-b border-gray-300">{product.description}</td>
              <td className="px-4 py-2 border-b border-gray-300">{product.variants}</td>
              <td className="px-4 py-2 border-b border-gray-300">
                {product.approved ? "Si" : "No"}
              </td>
              <td className="px-4 py-2 border-b border-gray-300">
                {new Date(product.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RequestProductTable
