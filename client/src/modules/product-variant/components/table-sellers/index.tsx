import React, { useState, useMemo } from "react"
import { CheckCircleSolid } from "@medusajs/icons"
import { Badge } from "@medusajs/ui"
import { Table, DropdownMenu, IconButton, Input, Select } from "@medusajs/ui"
import { Avatar } from "@nextui-org/react"
import { HiOutlineShoppingCart } from "react-icons/hi2"
import { Button } from "@nextui-org/react"

interface Seller {
  store_id: string
  store_name: string
  email: string
  amount: number
  price: number
}

interface TableProps {
  sellers: Seller[]
  selectedSeller: Seller | null
  setSelectedSeller: React.Dispatch<React.SetStateAction<Seller>>
}
const dataSelecterPAge = [10, 20, 30]
const TableSeller: React.FC<TableProps> = ({
  sellers,
  selectedSeller,
  setSelectedSeller,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const totalPages = Math.ceil(sellers.length / itemsPerPage)

  const handleRowClick = (seller: Seller) => {
    setSelectedSeller(seller)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: any) => {
    setItemsPerPage(parseInt(value, 10))
    setCurrentPage(1)
  }

  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sellers.slice(startIndex, endIndex)
  }, [sellers, currentPage, itemsPerPage])

  return (
    <div
      className=" bg-white p-8 border border-gray-200 rounded-lg"
      id="list-sellers"
    >
      <h3 className="mt-[-45px] bg-white text-center font-normal  text-gray-600 w-[50%] mb-4">
        {" "}
        Más vendedores para este producto{" "}
      </h3>
      <div className="">
        <div className="">
          <table className="rounded-[5px] ">
            <tbody>
              {paginatedSellers.map((seller) => (
                <tr
                  key={seller.store_id}
                  className={`w-full border-2  border-[#e7e7e7] cursor-pointer  ${
                    selectedSeller?.store_id === seller.store_id
                      ? "bg-gray-100 hover:bg-gray-100 shadow-lg"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => handleRowClick(seller)}
                >
                  <td className="w-[40%] p-4">
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <Avatar
                          isBordered
                          size="md"
                          color="secondary"
                          className=""
                          name={seller.store_name}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">
                          {seller.store_name}
                        </h3>
                        <p className="text-xs font-normal text-gray-500">
                          VENDEDOR EXCELENTE
                        </p>
                        <p className="text-xs font-normal text-gray-500">
                          <span className="font-bold">100%</span> Comentarios
                          positivos
                        </p>
                      </div>
                      <div className="mt-8 flex items-center gap-2 ite">
                        | <HiOutlineShoppingCart size={15} /> 0
                      </div>
                    </div>
                  </td>

                  <td className=" w-[20%] p-4">
                    {seller.amount ? (
                      <Badge
                        className="bg-white border-0 shadow-md"
                        color="green"
                      >
                        Con: {seller.amount} en stock:
                      </Badge>
                    ) : (
                      <Badge
                        className="bg-white border-0 shadow-md"
                        color="red"
                      >
                        Sin stock
                      </Badge>
                    )}
                  </td>

                  <td className="w-[20%] p-4">
                    <span className=" text-sm font-extrabold ">
                      Precio: $ {seller.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TableSeller
