"use client"

import { useState, useEffect } from "react"
import React from "react"
import { XMarkMini } from "@medusajs/icons"
import { Accordion, AccordionItem, Snippet, Button, Input } from "@heroui/react"
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

type SerialCodeResponse = {
  serialCodes: SerialCodes[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

const dataSelecterPage = [10, 20, 30, 50, 100]

const SerialCodeTable: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [serialCodes, setSerialCodes] = useState<SerialCodes[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('')

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  }

  const loadSerialCodes = async () => {
    setLoading(true)
    try {
      
      const result = await getListSerialCode({
        page,
        limit: rowsPerPage,
        search: searchQuery
      })
      
      
      const codesArray = Array.isArray(result.serialCodes) ? result.serialCodes : []
      
      setSerialCodes(codesArray)
      setTotalCount(result.totalCount || 0)
      setTotalPages(result.totalPages || 1)
      
    } catch (error) {
      console.error("Error al cargar códigos seriales:", error)
      setSerialCodes([])
      setTotalCount(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSerialCodes()
  }, [page, rowsPerPage, searchQuery])
  
  const handleSearch = () => {
    if (searchQuery !== localSearchTerm) {
      setSearchQuery(localSearchTerm)
      setPage(1) 
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value)
    setRowsPerPage(newRowsPerPage)
    setPage(1)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex justify-between  gap-4 w-full">
          <div className="flex items-center gap-2">
          <Input
              placeholder="Buscar por producto, orden o tienda..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              className="bg-lila-gf hover:bg-lila-gf/80 text-white rounded-[5px]"
            >
              Buscar
            </Button>
          </div>

          <div className="flex flex-col items-end gap-2 max-w-md">
          <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">
                Por página:
              </label>
              <select
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
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
          
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {serialCodes?.length || 0} de {totalCount} códigos
            </span>
          </div>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md md:text-base text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left">Numero orden</th>
                <th className="py-2 text-left">Fecha</th>
                <th className="py-2 text-left">Producto</th>
                <th className="py-2 text-left">Nombre de la tienda</th>
                <th className="py-2 text-left">Items</th>
                <th className="py-2 text-left">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                serialCodes.map((code: SerialCodes, i: number) => (
                  <tr
                    key={code.store_variant_order}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      {code.order_number}
                    </td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2 font-medium">
                      {code.product_name}
                    </td>

                    <td className="px-4 py-2 text-lila-gf">
                      {code.store_name}
                    </td>

                    <td className="px-4 py-2">
                      <Accordion
                        showDivider={false}
                        className="flex flex-col gap-1 w-full"
                        variant="shadow"
                        itemClasses={itemClasses}
                      >
                        <AccordionItem
                          key={i}
                          aria-label="Items"
                          startContent={<FaEye className="text-lila-gf" />}
                          subtitle={
                            <p className="flex min-w-[100px]">
                              {code.serial_codes.length}
                              {" Items "}
                            </p>
                          }
                          title={<p className="flex"></p>}
                        >
                          {code.serial_codes.map((serialCode: string, idx: number) => (
                            <div key={idx}>
                              <Snippet
                                size="sm"
                                className="text-xs"
                                color="default"
                              >
                                {serialCode}
                              </Snippet>
                            </div>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <DownloadButton
                        data={code.serial_codes}
                        filename={code.product_name}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <Loader />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!isLoading && (!serialCodes || serialCodes.length === 0) && totalCount === 0 && (
            <div className="p-10 flex w-full text-center items-center justify-center text-lg">
              <XMarkMini />{" "}
              {searchQuery ? "No se encontraron resultados" : "Sin códigos seriales"}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1 || isLoading}
              size="sm"
              variant="bordered"
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, page - 2) + i
                if (pageNumber > totalPages) return null
                
                return (
                  <Button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={isLoading}
                    size="sm"
                    variant={pageNumber === page ? "solid" : "bordered"}
                    className={pageNumber === page ? "bg-blue-600 text-white" : ""}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>
            
            <Button
              onClick={handleNextPage}
              disabled={page === totalPages || isLoading}
              size="sm"
              variant="bordered"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SerialCodeTable
