"use client"
import React, { useState, useEffect } from "react"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react"
import { getListProductSerials } from "@modules/account/actions/serial-code/get-seller-product-serials"
import ButtonLigth from "@modules/common/components/button_light"
import Loader from "@lib/loader"
import { DownloadIcon, GarbageIcon } from "@lib/util/icons"
import { Snippet } from "@heroui/react"
import { XMark, ArrowLongRight, ArrowLongLeft, Trash } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import DeleteSerialCode from "@modules/account/actions/serial-code/delete-serial-code"
import DeletetSerials from "./delete-product-serials"

type props = {
  productData: StoreProducVariant
  setViewSerial: React.Dispatch<
    React.SetStateAction<StoreProducVariant | undefined>
  >
}
type StoreProducVariant = {
  description: string
  thumbnail: string
  productid: string
  producttitle: string
  productvariantid: string
  storeid: string
  storexvariantid: string
  variantid: string
  productvarianttitle: string
  quantity: string
  price: string
  serialCodeCount: number
  commission: string
  activate_low_stock: boolean
  stock_notificate: number
}
interface serials {
  id: string
  serial: string
  store_variant_order_id: boolean
  store_order_id: string
}

export default function ViewProductSerials({
  productData,
  setViewSerial,
}: props) {
  const {
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(true)
  const [serials, setSerials] = useState<serials[]>([])
  const [filteredSerials, setFilteredSerials] = useState<serials[]>([])
  const [selectedSerials, setSelectedSerials] = useState<serials[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(100)
  const [serialDelete, setSerialDelete] = useState<string[] | string>("")
  const [filterStatus, setFilterStatus] = useState<
    "all" | "sold" | "available"
  >("all")

  const totalPages = Math.ceil(filteredSerials.length / rowsPerPage)

  const handlergetListProductSerials = () => {
    setLoading(true)
    getListProductSerials(productData.storexvariantid).then((e) => {
      setSerials(e)
      setFilteredSerials(e)
      setLoading(false)
    })
  }

  useEffect(() => {
    handlergetListProductSerials()
  }, [])

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    let filtered = serials.filter(
      (serial) =>
        serial.serial.toLowerCase().includes(query) ||
        serial.store_order_id?.toLowerCase().includes(query)
    )

    if (filterStatus === "sold") {
      filtered = filtered.filter((serial) => serial.store_variant_order_id)
    } else if (filterStatus === "available") {
      filtered = filtered.filter((serial) => !serial.store_variant_order_id)
    }

    setFilteredSerials(filtered)
    setPage(1) // Reiniciar la paginación al aplicar un filtro
  }, [searchQuery, filterStatus, serials])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = serials.filter((serial) => {
      if (
        serial.serial.toLowerCase().includes(query) ||
        serial.store_order_id?.toLowerCase().includes(query)
      ) {
        return serial
      }
    })

    setFilteredSerials(filtered)
    setPage(1) // Reiniciar la paginación al aplicar un filtro
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as "all" | "sold" | "available")
  }

  const toggleSelectSerial = (serial: serials) => {
    setSelectedSerials((prevSelected) =>
      prevSelected.find((s) => s.id === serial.id)
        ? prevSelected.filter((s) => s.id !== serial.id)
        : [...prevSelected, serial]
    )
  }

  const handleSelectAll = () => {
    const currentPageSerials = filteredSerials
      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
      .filter((serial) => !serial.store_variant_order_id)
    const allSelected = currentPageSerials.every((serial) =>
      selectedSerials.some((s) => s.id === serial.id)
    )
    if (allSelected) {
      setSelectedSerials([])
    } else {
      setSelectedSerials((prevSelected) => [
        ...prevSelected,
        ...currentPageSerials.filter(
          (serial) => !prevSelected.some((s) => s.id === serial.id)
        ),
      ])
    }
  }

  const handleDownloadSerials = () => {
    const serialData = serials
      .map(
        (serial) =>
          `${serial.serial},${
            serial.store_variant_order_id ? "Vendido" : "Disponible"
          }`
      )
      .join("\n")
    const blob = new Blob([serialData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${productData.productvarianttitle}_serials.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1) // Reiniciar la paginación al cambiar el tamaño de la página
  }

  const onDeleteListSerial = () => {
    if (!selectedSerials.length) return
    const idsSerial = selectedSerials.map((serial) => serial.id)
    setSerialDelete(idsSerial)
    onOpenDelete()
  }

  const onDeleteSerial = (id: string) => {
    setSerialDelete(id)
    onOpenDelete()
  }

  return (
    <>
      <div className="relative">
        <>
          <div className="absolute top-2 left-2">
            <ButtonLigth
              className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
              onClick={() => {
                setViewSerial(undefined)
              }}
            >
              <ArrowLongLeft className="mr-2" />
              Volver
            </ButtonLigth>{" "}
          </div>
          <p className="text-2xl  font-bold text-gray-700 text-center gap-2 pt-3 px-6 w-full">
            Inventario para: {productData.productvarianttitle}
          </p>

          <div className="  m-5 w-[80%] mx-auto shadow-md p-5 ">
            <div className="flex justify-between items-center  mb-5">
              <Input
                size="sm"
                type="text"
                placeholder="Buscar serial..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-1/3"
              />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="border rounded-md p-1 text-sm"
              >
                <option value="all">Todos</option>
                <option value="sold">Vendido</option>
                <option value="available">Disponible</option>
              </select>
            </div>
            <div className=" max-h-[50vh] w-full overflow-y-auto ">
              {loading ? (
                <div className="flex items-center justify-center w-40 h-40">
                  <Loader />
                </div>
              ) : (
                <div className="w-full">
                  <table className="bg-white mx-2  w-[90%] overflow-y-auto">
                    <thead className="">
                      <tr className="bg-white z-10">
                        <th className="pl-3 border-b border-gray-200 text-left">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={filteredSerials
                              .slice(
                                (page - 1) * rowsPerPage,
                                page * rowsPerPage
                              )
                              .filter(
                                (serial) => !serial.store_variant_order_id
                              )
                              .every((serial) => {
                                return selectedSerials.some(
                                  (s) => s.id === serial.id
                                )
                              })}
                          />
                        </th>
                        <th className="pl-3  border-b border-gray-200 text-left">
                          Serial
                        </th>
                        <th className="pl-3  border-b border-gray-200 text-left">
                          Estado
                        </th>
                        <th className="pl-3  border-b border-gray-200 text-left">
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="  ">
                      {filteredSerials
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                        .map((data) => (
                          <tr key={data.id} className="hover:bg-gray-50">
                            <td className="pl-6 py-2">
                              {data.store_variant_order_id ? (
                                <></>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={selectedSerials.some(
                                    (serial) => serial.id === data.id
                                  )}
                                  onChange={() => toggleSelectSerial(data)}
                                />
                              )}
                            </td>
                            <td className=" px-3 py-2 text-sm text-gray-700">
                              <Snippet>{data.serial}</Snippet>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700">
                              {data.store_variant_order_id
                                ? `Vendido:  ${data.store_order_id}`
                                : "Disponible"}
                            </td>
                            <td>
                              {data.store_variant_order_id ? (
                                <></>
                              ) : (
                                <IconButton
                                  className="hover:bg-white hover:text-white hover:scale-110 transition-all"
                                  variant="transparent"
                                  onClick={() => onDeleteSerial(data.id)}
                                >
                                  <GarbageIcon />
                                </IconButton>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4 ">
              <div className="flex items-center gap-4">
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="border rounded-md p-2"
                >
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                </select>
                <p>
                  Página {page} de {totalPages}
                </p>

                <p>
                  <span className="font-bold">Códigos disponibles:</span>{" "}
                  {productData.quantity}
                </p>
                <p>
                  <span className="font-bold">Códigos vendidos:</span>{" "}
                  {productData.serialCodeCount}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ArrowLongLeft
                    className={`${page === 1 ? "text-gray-500" : ""}`}
                  />
                </button>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ArrowLongRight
                    className={`${page === totalPages ? "text-gray-500" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center sm:flex-row  mt-6 gap-4 py-4 px-2 sm:px-10">
            {/* <ButtonLigth
                  color="primary"
                  className="bg-[#28A745] hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                  onClick={onClose}
                >
                  Cerrar
                </ButtonLigth> */}
            <ButtonLigth
              color="primary"
              className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none w-full sm:w-auto gap-2"
              onClick={handleDownloadSerials}
            >
              <DownloadIcon />
              Descargar todos
            </ButtonLigth>
            <ButtonLigth
              disabled={!selectedSerials.length}
              color="primary"
              className="bg-[#ff0040cc] hover:bg-[#ff0040] text-white border-none w-full sm:w-auto"
              onClick={onDeleteListSerial}
            >
              Eliminar Seleccionados
            </ButtonLigth>
          </div>
        </>
      </div>

      <DeletetSerials
        onCloseDelete={onCloseDelete}
        serials={serialDelete}
        handlergetListProductSerials={handlergetListProductSerials}
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
      />
    </>
  )
}
