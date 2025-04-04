import React, { useState, useMemo } from "react"
import { CheckCircleSolid } from "@medusajs/icons"
import { Badge } from "@medusajs/ui"
import { Table, DropdownMenu, IconButton, Select } from "@medusajs/ui"
import { Avatar } from "@heroui/react"
import { HiOutlineShoppingCart } from "react-icons/hi2"
import { Button } from "@heroui/react"
import { Input } from "@heroui/react"
import Link from "next/link"
import { Tooltip } from "@heroui/tooltip"
import { BlankIcon } from "@lib/util/icons"

interface Seller {
  store_variant_id: string
  store_id: string
  store_name: string
  email: string
  quantity: number
  price: number
  avatar: string
  parameters: {
    rating: number
    sales: number
  }
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
      className="bg-white p-8 border border-gray-200 rounded-lg shadow-lg"
      id="list-sellers"
    >
      <h3 className="mt-[-45px] bg-white text-center font-semibold w-[50%] mb-4">
        Más vendedores para este producto
      </h3>
      <div className="overflow-x-auto">
        {/* Contenedor principal que reemplaza la tabla */}
        <div className="w-full rounded-[5px]">
          {paginatedSellers.map((seller) => (
            <div
              key={seller.store_id}
              className={`flex flex-col md:flex-row w-full border-2 border-[#e7e7e7] p-4 ${
                selectedSeller?.store_id === seller.store_id
                  ? "bg-gray-100 hover:bg-gray-100 shadow-lg"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {/* Celda 1: Información del vendedor */}
              <div className="flex-1 flex flex-col md:flex-row items-center gap-2">
                <Tooltip
                  className="border border-[#7b39c4]"
                  content={`Ver la tienda de ${seller.store_name}`}
                >
                  <Link href={`/seller/store/${seller.store_id}`}>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex items-center">
                        <Avatar
                          isBordered
                          size="md"
                          color="secondary"
                          src={seller.avatar}
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <div className="flex flex-row  items-center gap-2 whitespace-nowrap">
                          <h3 className="text-sm font-bold">
                            {seller.store_name}
                          </h3>
                          <BlankIcon width={15} />
                        </div>
                        <p className="text-xs font-normal text-gray-500">
                          Vendedor excelente
                        </p>
                        <p className="text-xs font-normal text-gray-500">
                          <span className="font-bold">
                            {seller.parameters?.rating
                              ? `${seller.parameters?.rating}% Comentarios positivos`
                              : "Sin compras"}
                          </span>
                        </p>
                      </div>
                      <div className="hidden mt-2 md:mt-0 md:flex items-center gap-2">
                        | <HiOutlineShoppingCart size={15} />{" "}
                        {seller.parameters?.sales ?? 0}
                      </div>
                    </div>
                  </Link>
                </Tooltip>
              </div>

              {/* Celda 2: Stock */}
              <div className="flex-1 flex items-center justify-center md:justify-start  md:p-4 p-2">
                {seller.quantity ? (
                  <Badge className="bg-white border-0 shadow-md" color="green">
                    Con: {seller.quantity} en stock
                  </Badge>
                ) : (
                  <Badge className="bg-white border-0 shadow-md" color="red">
                    Sin stock
                  </Badge>
                )}
              </div>

              {/* Celda 3: Precio */}
              <div className="flex-1 flex items-center justify-center md:justify-start md:p-4 p-2">
                <span className="text-sm font-extrabold">
                  Precio: $ {seller.price}
                </span>
              </div>

              {/* Celda 4: Botón de selección */}
              <div className="flex-1 flex items-center justify-center md:justify-start  md:p-4 p-2">
                <Button
                  disabled={seller.quantity ? false : true}
                  onClick={() => handleRowClick(seller)}
                  className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px]"
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableSeller
