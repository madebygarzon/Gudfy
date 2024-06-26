import React, { useState, useMemo } from "react"
import { CheckCircleSolid } from "@medusajs/icons"
import { Badge } from "@medusajs/ui"
import { Table, DropdownMenu, IconButton, Input, Select } from "@medusajs/ui"
import { Avatar } from "@nextui-org/react"
import { HiOutlineShoppingCart } from "react-icons/hi2"

interface Seller {
  store_variant_id: string
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
const TableSellerDefault: React.FC<TableProps> = ({
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

  const sellerWithLowestPrice = useMemo(() => {
    return sellers.reduce(
      (minSeller, currentSeller) =>
        currentSeller.price < minSeller.price ? currentSeller : minSeller,
      sellers[0]
    )
  }, [sellers])

  return (
    <div className="">
      <h3 className="mt-[-33px] text-center font-normal bg-white text-gray-600 w-[50%] ">
        Mejor oferta
      </h3>
      <div className="">
        <div className="flex gap-4 my-2">
          <div className="flex items-center">
            <Avatar
              isBordered
              size="md"
              color="secondary"
              className=""
              name={sellerWithLowestPrice.store_name}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {sellerWithLowestPrice.store_name}
            </h3>
            <p className="text-xs font-normal text-gray-500">
              <span className="font-bold">100%</span> Comentarios positivos
            </p>
          </div>
          <div className="flex mt-4 items-center gap-2">
            | <HiOutlineShoppingCart size={15} /> 0
          </div>
        </div>
        <div className="ml-[-13px] mb-4 ">
          {sellerWithLowestPrice.amount ? (
            <Badge className="bg-white border-2 border-white" color="green">
              En stock: {sellerWithLowestPrice.amount}
            </Badge>
          ) : (
            <Badge className="bg-white" color="red">
              Sin Stock
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableSellerDefault
