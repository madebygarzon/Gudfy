import React, { useState, useMemo } from "react"
import { CheckCircleSolid } from "@medusajs/icons"
import { Badge } from "@medusajs/ui"
import { Table, DropdownMenu, IconButton, Input, Select } from "@medusajs/ui"

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
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-blod"> Vendedores </h3>
      <div className=" w-full h-full">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre Tienda</Table.HeaderCell>
                <Table.HeaderCell>Correo</Table.HeaderCell>
                <Table.HeaderCell>Stock</Table.HeaderCell>
                <Table.HeaderCell>Precio</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedSellers.map((seller) => (
                <Table.Row
                  key={seller.store_id}
                  className={`cursor-pointer ${
                    selectedSeller?.store_id === seller.store_id
                      ? "bg-blue-100 border  shadow"
                      : ""
                  }`}
                  onClick={() => handleRowClick(seller)}
                >
                  <Table.Cell>{seller.store_name}</Table.Cell>
                  <Table.Cell>{seller.email}</Table.Cell>
                  <Table.Cell>
                    {seller.amount ? (
                      <Badge color="green">Con Stock: {seller.amount}</Badge>
                    ) : (
                      <Badge color="red">Sin Stock</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>$ {seller.price}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex justify-between items-center py-3">
          <div>
            <Select onValueChange={handleItemsPerPageChange} size="small">
              <Select.Trigger>
                <Select.Value placeholder="10" />
              </Select.Trigger>
              <Select.Content>
                {dataSelecterPAge.map((item) => (
                  <Select.Item key={item} value={`${item}`}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-1 border rounded-md text-xs ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableSeller
