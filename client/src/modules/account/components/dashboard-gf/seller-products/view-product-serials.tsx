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
} from "@nextui-org/react"
import { getListProductSerials } from "@modules/account/actions/serial-code/get-seller-product-serials"
import ButtonLigth from "@modules/common/components/button_light"
import Loader from "@lib/loader"
import { DownloadIcon } from "@lib/util/icons"
import { Snippet } from "@nextui-org/react"
import { XMark, ArrowLongRight, ArrowLongLeft, Trash } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import DeleteSerialCode from "@modules/account/actions/serial-code/delete-serial-code"
import DeletetSerials from "./delete-product-serials"

type props = {
  productData: StoreProducVariant
  onOpenChange: () => void
  isOpen: boolean
  setReset: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
}
type StoreProducVariant = {
  productvarianttitle: string
  storexvariantid: string
  quantity: string
  serialCodeCount: number
}
interface serials {
  id: string
  serial: string
  store_variant_order_id: boolean
}

export default function ViewProductSerials({
  productData,
  onOpenChange,
  isOpen,
  onClose,
}: props) {
  const {
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(true)
  const [Serials, setSerials] = useState<serials[]>([])
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
    if (isOpen) {
      handlergetListProductSerials()
    }
  }, [isOpen])

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    let filtered = Serials.filter((serial) =>
      serial.serial.toLowerCase().includes(query)
    )

    if (filterStatus === "sold") {
      filtered = filtered.filter((serial) => serial.store_variant_order_id)
    } else if (filterStatus === "available") {
      filtered = filtered.filter((serial) => !serial.store_variant_order_id)
    }

    setFilteredSerials(filtered)
    setPage(1) // Reiniciar la paginación al aplicar un filtro
  }, [searchQuery, filterStatus, Serials])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    const filtered = Serials.filter((serial) =>
      serial.serial.toLowerCase().includes(query)
    )
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
    const serialData = Serials.map(
      (serial) =>
        `${serial.serial},${
          serial.store_variant_order_id ? "Vendido" : "Disponible"
        }`
    ).join("\n")
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent className="rounded-lg shadow-lg">
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl mt-2 font-bold text-gray-700 text-center flex flex-col gap-2 pt-6 px-6 sm:px-10">
                Inventario para: {productData.productvarianttitle}
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-bold">Códigos disponibles:</span>{" "}
                    {productData.quantity}
                  </p>
                  <p>
                    <span className="font-bold">Códigos vendidos:</span>{" "}
                    {productData.serialCodeCount}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody className="flex overflow-auto py-2 px-5 ">
                <div className="items-center">
                  <div>
                    <div className="mx-5 rounded-lg shadow-2xl overflow-y-auto max-h-[400px]">
                      {loading ? (
                        <div className="flex items-center justify-center w-40 h-40">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-2 mx-4">
                            <Input
                              size="sm"
                              type="text"
                              placeholder="Buscar serial..."
                              value={searchQuery}
                              onChange={handleSearch}
                              className="w-2/3"
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
                          <table className="bg-white mx-2">
                            <thead className="sticky top-0 bg-white p-4 z-30">
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
                                        (serial) =>
                                          !serial.store_variant_order_id
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
                                <th className="pl-3  border-b border-gray-200 text-left"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSerials
                                .slice(
                                  (page - 1) * rowsPerPage,
                                  page * rowsPerPage
                                )
                                .map((data) => (
                                  <tr
                                    key={data.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="pl-6 py-2">
                                      {data.store_variant_order_id ? (
                                        <></>
                                      ) : (
                                        <input
                                          type="checkbox"
                                          checked={selectedSerials.some(
                                            (serial) => serial.id === data.id
                                          )}
                                          onChange={() =>
                                            toggleSelectSerial(data)
                                          }
                                        />
                                      )}
                                    </td>
                                    <td className="w-full px-3 py-2 text-sm text-gray-700">
                                      <Snippet>{data.serial}</Snippet>
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-700">
                                      {data.store_variant_order_id
                                        ? "Vendido"
                                        : "Disponible"}
                                    </td>
                                    <td>
                                      {data.store_variant_order_id ? (
                                        <></>
                                      ) : (
                                        <IconButton
                                          onClick={() =>
                                            onDeleteSerial(data.id)
                                          }
                                        >
                                          <Trash className="text-red-600" />
                                        </IconButton>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between mt-4 mx-10">
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
                            className={`${
                              page === totalPages ? "text-gray-500" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center items-center sm:flex-row  mt-6 gap-4 py-4 px-6 sm:px-10">
                <ButtonLigth
                  color="primary"
                  className="bg-[#28A745] hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                  onClick={onClose}
                >
                  Cerrar
                </ButtonLigth>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
