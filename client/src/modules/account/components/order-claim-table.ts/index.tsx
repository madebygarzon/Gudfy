"use client"

import { useState, useEffect, useRef } from "react"
import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Button } from "@heroui/react"
import { IconButton, Select, Input as InputMedusa, Button as ButtonMedusa } from "@medusajs/ui"
import { XMark, ArrowLongRight, ArrowLongLeft, PlayMiniSolid, XMarkMini } from "@medusajs/icons"
import { useMeCustomer } from "medusa-react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import { orderClaim, useOrderGudfy } from "@lib/context/order-context"
import { getListClaimComments } from "@modules/account/actions/get-list-claim-comments"
import { postAddComment } from "@modules/account/actions/post-add-comment"
import { updateStatusClaim } from "@modules/account/actions/update-status-claim"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { updateStateNotification } from "@modules/account/actions/update-state-notification"
import io, { Socket } from "socket.io-client"
import Loader from "@lib/loader"
import { ChatIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"
import { SendIcon } from "@lib/util/icons"
import InputFile from "@modules/common/components/input-file"
import Image from "next/image"

type ClaimComments = {
  id?: string
  comment: string
  comment_owner_id: string
  order_claim_id?: string
  customer_id?: string
  created_at?: string
  image?: string
}

interface ModalClaimCommentProps {
  comments?: ClaimComments[]
  setComments: React.Dispatch<React.SetStateAction<ClaimComments[] | undefined>>
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
  claim?: orderClaim
}

const dataSelecterPage = [10, 20, 30, 50, 100]

const ClaimTable: React.FC = () => {
  const { 
    dataOrderClaims, 
    loadClaimsPage, 
    handlerListOrderClaim, 
    isLoadingClaim,
    totalClaimCount,
    currentClaimPage,
    setCurrentClaimPage,
    totalClaimPages,
    claimPageLimit,
    setClaimPageLimit,
    claimSearchTerm,
    setClaimSearchTerm
  } = useOrderGudfy()
  
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { notifications, setNotifications } = useNotificationContext()
  
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0])
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectOrderClaim, setSelectOrderClaim] = useState<orderClaim>()
  const [comments, setComments] = useState<ClaimComments[]>()

  const [filterStatus, setFilterStatus] = useState<
    "CERRADA" | "ABIERTA" | "RESUELTA" | "SIN RESOLVER" | "all"
  >("all")

  const filteredOrderClaims = dataOrderClaims
    .filter(claim => {
      if (filterStatus !== "all") {
        switch (filterStatus) {
          case "CERRADA":
            return claim.status_order_claim_id === "CANCEL_ID"
          case "ABIERTA":
            return claim.status_order_claim_id === "OPEN_ID"
          case "RESUELTA":
            return claim.status_order_claim_id === "SOLVED_ID"
          case "SIN RESOLVER":
            return claim.status_order_claim_id === "UNSOLVED_ID"
          default:
            return true
        }
      }
      return true
    })

  const handleReset = () => {
    handlerListOrderClaim(true)
  }
  
  const handleSearch = () => {
    setIsSearching(true)
    loadClaimsPage(1, rowsPerPage, claimSearchTerm)
      .finally(() => setIsSearching(false))
  }

  const handlerSelectClaimOrder = (claim: orderClaim) => {
    if (notifications.length) {
      let isNotifi = notifications.find((n) => n.order_claim_id === claim.id)

      if (isNotifi)
        updateStateNotification(isNotifi.id, false).then(() => {
          setNotifications((old) => old.filter((n) => n.id !== isNotifi?.id))
        })
    }
    setSelectOrderClaim(claim)
    getListClaimComments(claim?.id).then((e) => {
      setComments(e)
      onOpen()
    })
  }
  
  const paginatedClaims = filteredOrderClaims

  useEffect(() => {
    loadClaimsPage(1, rowsPerPage)
  }, [])
  
  useEffect(() => {
    loadClaimsPage(1, rowsPerPage, claimSearchTerm)
  }, [filterStatus, rowsPerPage])
  

  const handlePageChange = (newPage: number) => {
    loadClaimsPage(newPage, rowsPerPage, claimSearchTerm)
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col gap-y-8 w-full">
          <div className="flex justify-between gap-4 w-full">
            <div className="">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar orden"
                  value={localSearchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearchTerm(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      setClaimSearchTerm(localSearchTerm)
                      handleSearch()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    setClaimSearchTerm(localSearchTerm)
                    handleSearch()
                  }}
                  className="bg-lila-gf hover:bg-lila-gf/80 text-white rounded-[5px]"
                >
                  Buscar
                </Button>
              </div>
              {filteredOrderClaims && (
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>
                    Mostrando {paginatedClaims?.length || 0} de {totalClaimCount} reclamos
                  </span>
                  <span>
                    Página {currentClaimPage} de {totalClaimPages}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2 max-w-md">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Estado:
                </label>
                <select
                  id="status-filter"
                  className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lila-gf focus:outline-none text-sm bg-white"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(
                      e.target.value as
                        | "CERRADA"
                        | "ABIERTA"
                        | "RESUELTA"
                        | "SIN RESOLVER"
                        | "all"
                    )
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="CERRADA">Cerrada</option>
                  <option value="ABIERTA">Abierta</option>
                  <option value="RESUELTA">Resuelta</option>
                  <option value="SIN RESOLVER">Escalada al administrador</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Por página:
                </label>
                <select
                  className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lila-gf focus:outline-none text-sm bg-white"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const newRowsPerPage = parseInt(e.target.value)
                    setRowsPerPage(newRowsPerPage)
                    loadClaimsPage(1, newRowsPerPage, claimSearchTerm)
                  }}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md md:text-base text-sm">
              <thead>
                <tr>
                  <th className="py-2 text-left">
                    Estado
                  </th>
                  <th className="py-2 text-left">
                    Número de orden
                  </th>
                  <th className="py-2 text-left">
                    Detalles del producto
                  </th>
                  <th className="py-2 text-left">
                    Fecha y hora
                  </th>
                  <th className="py-2 text-center">
                    Chat
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingClaim ? (
                  paginatedClaims?.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-lg ${
                            claim.status_order_claim_id === "OPEN_ID" 
                              ? "bg-blue-500 text-white" 
                              : claim.status_order_claim_id === "CANCEL_ID" 
                              ? "bg-green-500 text-white" 
                              : claim.status_order_claim_id === "UNSOLVED_ID" 
                              ? "bg-orange-500 text-white" 
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {claim.status_order_claim_id === "OPEN_ID" 
                            ? "Abierta" 
                            : claim.status_order_claim_id === "CANCEL_ID" 
                            ? "Cerrada" 
                            : claim.status_order_claim_id === "UNSOLVED_ID" 
                            ? "Escalada" 
                            : "Resuelta"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {claim.number_order}
                      </td>
                      <td className="px-4 py-2">
                        <div>
                          <h3 className="font-semibold">
                            {claim.product_name}
                          </h3>
                          <p className="text-sm">
                            Cantidad: {claim.quantity}
                          </p>
                          <p className="text-sm">
                            por: {claim.store_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {handlerformatDate(claim.created_at)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="relative inline-block">
                          {notifications.some(n => 
                            n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID" && 
                            n.order_claim_id === claim.id
                          ) && <Notification />}
                          <ChatIcon
                            className="cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handlerSelectClaimOrder(claim)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center">
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!isLoadingClaim && !filteredOrderClaims?.length && (
              <div className="p-10 flex w-full text-center items-center justify-center text-lg">
                <XMarkMini /> {claimSearchTerm ? 'No se encontraron resultados' : 'Sin reclamaciones'}
              </div>
            )}
          </div>

          {totalClaimPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                onClick={() => handlePageChange(Math.max(1, currentClaimPage - 1))}
                disabled={currentClaimPage === 1 || isLoadingClaim}
                size="sm"
                variant="bordered"
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalClaimPages) }, (_, i) => {
                  const pageNumber = Math.max(1, currentClaimPage - 2) + i
                  if (pageNumber > totalClaimPages) return null
                  
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={isLoadingClaim}
                      size="sm"
                      variant={pageNumber === currentClaimPage ? "solid" : "bordered"}
                      className={pageNumber === currentClaimPage ? "bg-lila-gf text-white" : ""}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(Math.min(totalClaimPages, currentClaimPage + 1))}
                disabled={currentClaimPage === totalClaimPages || isLoadingClaim}
                size="sm"
                variant="bordered"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <ModalClaimComment
        comments={comments}
        setComments={setComments}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        claim={selectOrderClaim}
      />
    </>
  )
}

const ModalClaimComment = ({
  setComments,
  comments,
  isOpen,
  onOpenChange,
  handleReset,
  claim,
}: ModalClaimCommentProps) => {
  const [newComment, setNewComment] = useState<string>('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [image, setImage] = useState<File | undefined>()
  const [isLoadingStatus, setIsLoadingStatus] = useState<{
    solved: boolean
    cancel: boolean
    unsolved: boolean
  }>({ solved: false, cancel: false, unsolved: false })
  const { customer } = useMeCustomer()
  const messagesEndRef = useRef<HTMLDivElement>(null)


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [comments])

  const handlerSubmitComment = () => {
    if (!newComment?.trim() && !image) return
    
    const dataComment = {
      comment: newComment,
      order_claim_id: comments?.[0]?.order_claim_id,
      customer_id: customer?.id,
      comment_owner_id: "COMMENT_CUSTOMER_ID",
    }

    postAddComment(dataComment, image).then(() => {
      setImage(undefined)
      setNewComment("")
      setComments((old) => {
        return old?.length
          ? [
              ...old,
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_CUSTOMER_ID",
              },
            ]
          : [
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_CUSTOMER_ID",
              },
            ]
      })
    })
  }

  const handlerStatusClaim = (status: string) => {
    setIsLoadingStatus((old) => {
      let selectStatus
      switch (status) {
        case "CANCEL":
          selectStatus = { ...old, cancel: true }
          break
        case "SOLVED":
          selectStatus = { ...old, solved: true }
          break
        case "UNSOLVED":
          selectStatus = { ...old, unsolved: true }
          break
        default:
          selectStatus = old
      }
      return selectStatus
    })
    
    updateStatusClaim(comments?.[0]?.order_claim_id || "", status).then(() => {
      handleReset()
      onOpenChange()
    })
  }

  useEffect(() => {
    setImage(undefined)
    setNewComment('')
    setIsLoadingStatus({ solved: false, cancel: false, unsolved: false })
  }, [isOpen])

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")

    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
      if (data.order_claim_id === claim?.id) {
        getListClaimComments(claim?.id).then((e) => {
          setComments(e)
        })
      }
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [claim])

  const [canEscalate, setCanEscalate] = useState(false)

  useEffect(() => {
    if (claim?.created_at) {
      const createdAt = new Date(claim.created_at)
      const now = new Date()
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

      setCanEscalate(diffHours >= 12)
    }
  }, [claim])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior={"inside"}
      size="xl"
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <ModalContent className="rounded-2xl">
        {(onClose: () => void) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
              <h2 className="text-center text-lg font-semibold">
                Resolución de reclamos
              </h2>
            </ModalHeader>
            <ModalBody className="bg-gray-100 px-8 py-4 overflow-y-auto h-[60vh]">
              <div className="flex flex-col gap-2">
                {comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex w-full transition-transform duration-300 ease-in-out ${
                      comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 shadow-md text-sm ${
                        comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                          ? "bg-blue-400 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl"
                          : "bg-gray-200 text-gray-900 rounded-br-xl rounded-tr-xl rounded-tl-xl"
                      }`}
                    >
                      <p className="mb-1 text-xs font-bold">
                        {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                          ? "Yo"
                          : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "Admin Gudfy"
                          : claim?.store_name}
                      </p>
                      {comment.created_at && (
                        <p className={`text-[10px] mb-2 ${comment.comment_owner_id === "COMMENT_STORE_ID" ? "text-gray-500" : "text-white"}`}>
                          {new Date(comment.created_at).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                      )}
                      <p>{comment.comment}</p>
                      {comment.image ? (
                        <Image
                          src={comment.image}
                          alt={"Image"}
                          height={200}
                          width={200}
                          className="mt-2 rounded-md"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-slate-200 bg-gray-50 py-3 px-4 rounded-b-2xl">
              <div className="w-full">
                {claim?.status_order_claim_id !== "CANCEL_ID" && (
                  <div className="w-full">
                    <div className="flex items-center w-full gap-2 bg-white px-3 py-2 rounded-full shadow-md">
                      <Input
                        value={newComment}
                        size="sm"
                        radius="sm"
                        className="flex-1 text-sm focus:outline-none focus:ring-0 border-none placeholder-gray-400"
                        placeholder="Escribe un mensaje..."
                        onValueChange={setNewComment}
                      />
                      <SendIcon
                        onClick={handlerSubmitComment}
                        className={`p-1 flex items-center justify-center w-10 h-8 rounded-full shadow-md transition-all duration-200 ${
                          newComment?.trim() || image
                            ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                            : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                        style={{
                          pointerEvents: newComment?.trim() || image ? "auto" : "none"
                        }}
                      >
                        <PlayMiniSolid color={newComment?.trim() || image ? "#FFFFFF" : "#9CA3AF"} />
                      </SendIcon>
                    </div>
                    <div className="mt-2">
                      <InputFile
                        type="Normal"
                        alt="Image"
                        label="Adjuntar imagen  "
                        file={image}
                        setFile={setImage}
                        accept="image/*"
                      />
                    </div>

                    <div className="px-6 text-[10px] text-gray-600">
                      <p>
                        <span className="font-extrabold">
                          ⚠️ Aviso Importante:
                        </span>{" "}
                        Está prohibido compartir información personal, enlaces o
                        datos de la cuenta o tienda en este chat. El
                        incumplimiento resultará en la suspensión del reclamo.
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4 px-6 text-xs text-gray-600">
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <ButtonLigth
                      color="primary"
                      className="bg-[#28A745] px-3 hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                      onClick={() => handlerStatusClaim("CANCEL")}
                      isLoading={isLoadingStatus.cancel}
                      disabled={claim?.status_order_claim_id === "CANCEL_ID"}
                    >
                      Cerrar reclamo
                    </ButtonLigth>

                    <ButtonLigth
                      className="bg-[#E74C3C] px-3 hover:bg-[#C0392B] text-white border-none w-full sm:w-auto"
                      onClick={() => handlerStatusClaim("UNSOLVED")}
                      isLoading={isLoadingStatus.unsolved}
                      disabled={
                        claim?.status_order_claim_id === "CANCEL_ID" ||
                        claim?.status_order_claim_id === "UNSOLVED_ID" ||
                        !canEscalate
                      }
                    >
                      Escalar con un administrador
                    </ButtonLigth>
                  </div>
                  {!canEscalate && (
                    <p className="text-xs text-center text-gray-600 mt-2">
                      ¡Puedes escalar este reclamo al administrador pasadas 12
                      horas!
                    </p>
                  )}
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ClaimTable
