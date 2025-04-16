"use client"

import { useState, useEffect } from "react"
import React from "react"
import { XMarkMini } from "@medusajs/icons"
import { Input } from "@medusajs/ui"
import { Accordion, AccordionItem, Snippet } from "@heroui/react"
import { FaEye } from "react-icons/fa6"
import { getListSerialCode } from "@modules/account/actions/serial-code/get-list-serial-code"
import Loader from "@lib/loader"
import DownloadButton from "@modules/common/components/download-button"
import Thumbnail from "@modules/products/components/thumbnail"

type SerialCodes = {
  store_variant_order: string
  quantity: number
  order_number: string
  store_name: string
  product_name: string
  thumbnail: string
  serial_codes: string[]
  created_at: string
}

const dataSelecterPage = [10, 20, 30]

const SerialCodeTable: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [listSerialCodes, setListSerialCodes] = useState<SerialCodes[]>()
  const [filteredCodes, setFilteredCodes] = useState<SerialCodes[]>()
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination controls
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0])
  const [pageTotal, setPageTotal] = useState(1)

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  }

  const handlerGetListSerialCodes = () => {
    getListSerialCode().then((e) => {
      setListSerialCodes(e)
      setLoading(false)
    })
  }

  useEffect(() => {
    handlerGetListSerialCodes()
  }, [])

  // Filter and search effect
  useEffect(() => {
    if (!listSerialCodes) return

    const filtered = listSerialCodes.filter(
      (code) =>
        code.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.store_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCodes(filtered)
    setPage(1) // Reset to first page when search changes
  }, [searchQuery, listSerialCodes])

  // Update total pages
  useEffect(() => {
    if (!filteredCodes) return
    setPageTotal(Math.ceil(filteredCodes.length / rowsPerPage))
  }, [filteredCodes, rowsPerPage])

  const handleNextPage = () => {
    if (page < pageTotal) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value)
    setRowsPerPage(newRowsPerPage)
    setPage(1)
  }

  const paginatedCodes = filteredCodes?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-[170px]">
            <Input
              className="w-full bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300"
              placeholder="Buscar"
              id="search-input"
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md md:text-base text-xs">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Numero orden</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Producto</th>

                <th className="px-4 py-2 text-left">Nombre de la tienda</th>
                <th className="px-4 py-2 text-left">Items</th>
                <th className="px-4 py-2 text-left">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                paginatedCodes?.map((code, i) => (
                  <tr
                    key={code.store_variant_order}
                    className="hover:bg-gray-50 items-center"
                  >
                    {/* <td className="md:px-4 py-2 px-2 ">{code.created_at}</td> */}
                    <td className="md:px-4 py-2 px-2 text-sm">
                      {code.order_number}
                    </td>
                    <td className="md:px-4 py-2 px-2 text-sm">
                      {new Date(code.created_at).toLocaleString("es-CO", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "America/Bogota",
                      })}
                    </td>
                    <td className=" md:px-4 py-2 px-2 font-bold text-sm">
                      {code.product_name}
                    </td>

                    <td className="md:px-4 py-2 px-2 text-sm text-lila-gf ">
                      {code.store_name}
                    </td>

                    <td className="md:px-4 py-2 px-2 text-center text-sm">
                      <Accordion
                        showDivider={false}
                        className="p-2 flex flex-col gap-1 w-full "
                        variant="shadow"
                        itemClasses={itemClasses}
                      >
                        <AccordionItem
                          className="text-sm md:text-base"
                          key={i}
                          aria-label="Items"
                          startContent={<FaEye className="text-lila-gf" />}
                          subtitle={
                            <p className="flex text-sm min-w-[100px]">
                              {code.serial_codes.length}
                              {" Items - "}
                              <span className="text-lila-gf ml-1 text-sm ">
                                Ver más
                              </span>
                            </p>
                          }
                          title={
                            <p className="flex text-sm">Listado de ítems</p>
                          }
                        >
                          {code.serial_codes.map((code) => (
                            <div>
                              <Snippet
                                size="sm"
                                className="text-xs"
                                color="default"
                              >
                                {code}
                              </Snippet>
                            </div>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    </td>
                    <td className="text-center">
                      <DownloadButton
                        data={code.serial_codes}
                        filename={code.product_name}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <div className="p-6">
                  <Loader />
                </div>
              )}
            </tbody>
          </table>
          {!isLoading && !filteredCodes?.length && (
            <div className="p-10 flex w-full text-center items-center justify-center text-lg">
              <XMarkMini />{" "}
              {searchQuery ? "No se encontraron resultados" : "Sin compras"}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {filteredCodes && filteredCodes.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 mt-6 gap-4">
            <div className="flex items-center gap-4">
              <p className="md:text-sm text-xs whitespace-nowrap">{`${filteredCodes.length} items`}</p>
              <select
                className="bg-white text-gray-600 border border-gray-300 rounded-lg p-1 text-sm"
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(e.target.value)}
              >
                {dataSelecterPage.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 md:text-base text-sm">
              <span>
                {page} de {pageTotal}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={handlePrevPage}
                  className="disabled:opacity-50 p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  disabled={page === pageTotal}
                  onClick={handleNextPage}
                  className="disabled:opacity-50 p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SerialCodeTable
