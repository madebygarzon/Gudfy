"use client"
import { useState, useEffect } from "react"
import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react"
import { ChatBubble, PlayMiniSolid } from "@medusajs/icons"
import { Button as ButtonMedusa } from "@medusajs/ui"
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
import { hasPassed48Hours } from "@lib/util/date-for-escalation-admin"
import io, { Socket } from "socket.io-client"
import Loader from "@lib/loader"
import { ChatIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"
import { SendIcon } from "@lib/util/icons"

type orders = {
  orders: order[]
}

const ClaimTable: React.FC = () => {
  const { listOrderClaim, handlerListOrderClaim, isLoadingClaim } =
    useOrderGudfy()
  const [selectOrderClaim, setSelectOrderClaim] = useState<orderClaim>()

  const [filterStatus, setFilterStatus] = useState<
    "CERRADA" | "ABIERTA" | "RESUELTA" | "SIN RESOLVER" | "all"
  >("all")

  const filteredOrderClaims =
    filterStatus === "all"
      ? listOrderClaim
      : listOrderClaim?.filter((claim) => {
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
        })

  const handleReset = () => {
    handlerListOrderClaim()
  }
  const { notifications, setNotifications } = useNotificationContext()
  const [comments, setComments] = useState<ClaimComments[]>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }

  const handlerSelectClaimOrder = (claim: orderClaim) => {
    if (notifications.length) {
      let isNotifi = notifications.find((n) => n.order_claim_id === claim.id)

      if (isNotifi)
        updateStateNotification(isNotifi.id, false).then(() => {
          setNotifications((old) => old.filter((n) => n.id !== isNotifi.id))
        })
    }
    setSelectOrderClaim(claim)
    getListClaimComments(claim?.id).then((e) => {
      setComments(e)
      onOpen()
    })
  }

  useEffect(() => {
    handlerListOrderClaim()
  }, [])

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4">
          <div>
            <label
              htmlFor="status-filter"
              className="mr-4 font-semibold text-gray-700 text-sm lg:text-base"
            >
              Filtrar por estado:
            </label>
            <select
              id="status-filter"
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm lg:text-base bg-white"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "CERRADA"
                    | "ABIERTA"
                    | "RESUELTA"
                    | "SIN RESOLVER"
                    | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="CERRADA">Cerrada</option>
              <option value="ABIERTA">Abierta</option>
              <option value="RESUELTA">Resuelta</option>
              <option value="SIN RESOLVER">Escalada al administrador</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 text-left">Estado del reclamo</th>
                <th className="py-2 text-left">Orden número</th>
                <th className="py-2 text-left">Detalles del producto</th>
                <th className="py-2 text-left">Fecha y hora de creación</th>
                <th className="py-2 text-left">Chat</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingClaim ? (
                filteredOrderClaims?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td>
                      {claim.status_order_claim_id === "OPEN_ID" ? (
                        <div className="mx-1 p-3 bg-blue-200 rounded-md">
                          Abierta
                        </div>
                      ) : claim.status_order_claim_id === "CANCEL_ID" ? (
                        <div className="mx-1 p-3 bg-green-200 rounded-md">
                          Cerrada
                        </div>
                      ) : claim.status_order_claim_id === "UNSOLVED_ID" ? (
                        <div className="mx-1 p-3 bg-orange-200 rounded-md">
                          Escalada al administrador
                        </div>
                      ) : (
                        claim.status_order_claim_id === "SOLVED_ID" && (
                          <div className="mx-1 p-2 bg-green-200 rounded-md">
                            Resuelta
                          </div>
                        )
                      )}
                    </td>
                    <td className=" py-2">
                      {handlerOrderNumber(claim.number_order)}
                    </td>
                    <td className=" py-2">
                      <div>
                        <h3 className="font-semibold">{claim.product_name}</h3>
                        <p className="text-xs">Cantidad: {claim.quantity}</p>
                        <p className="text-xs">por: {claim.store_name}</p>
                      </div>
                    </td>
                    <td className=" py-2">
                      {handlerformatDate(claim.created_at)}
                    </td>

                    <td className=" p4-2">
                      <div className="relative">
                        {notifications.map((n) => {
                          if (
                            n.notification_type_id ===
                              "NOTI_CLAIM_CUSTOMER_ID" &&
                            n.order_claim_id === claim.id
                          ) {
                            return <Notification />
                          }
                        })}
                      </div>
                      <ChatIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          handlerSelectClaimOrder(claim)
                        }}
                      />{" "}
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
    </div>
  )
}
type ClaimComments = {
  id?: string
  comment: string
  comment_owner_id: string
  order_claim_id?: string
  customer_id?: string
  created_at?: string
}

interface ModalClaimComment {
  comments?: ClaimComments[]
  setComments: React.Dispatch<React.SetStateAction<ClaimComments[] | undefined>>
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
  claim?: orderClaim
}

const ModalClaimComment = ({
  setComments,
  comments,
  isOpen,
  onOpenChange,
  handleReset,
  claim,
}: ModalClaimComment) => {
  const [newComment, setNewComment] = useState<string>()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState<{
    solved: boolean
    cancel: boolean
    unsolved: boolean
  }>({ solved: false, cancel: false, unsolved: false })
  const { customer } = useMeCustomer()
  const handlerSubmitComment = () => {
    const dataComment = {
      comment: newComment,
      order_claim_id: comments?.[0].order_claim_id,
      customer_id: customer?.id,
      comment_owner_id: "COMMENT_CUSTOMER_ID",
    }

    postAddComment(dataComment).then((e) => {
      setNewComment("")
      setComments((old) => {
        // se debe de arreglar un un reset
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
    updateStatusClaim(comments?.[0].order_claim_id || " ", status).then(() => {
      handleReset()
      onOpenChange()
    })
  }

  useEffect(() => {
    setIsLoadingStatus({ solved: false, cancel: false, unsolved: false })
  }, [])

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")

    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
      // Si la notificación es para el cliente correcto, agregarla a la lista

      if (data.order_claim_id === claim?.id)
        getListClaimComments(claim?.id).then((e) => {
          setComments(e)
        })
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect() // Desconectar el socket cuando el componente se desmonta
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
        {(onClose) => (
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
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
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
                        className="cursor-pointer p-1 flex items-center justify-center w-10 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
                      >
                        <PlayMiniSolid color="#FFFFFF" />
                      </SendIcon>
                    </div>
                    <div className="mt-4 px-6 text-xs text-gray-600">
                      *Estimado cliente, le informamos que dispone de varias
                      opciones para gestionar su reclamación. Le invitamos a
                      elegir la alternativa que mejor se ajuste a sus
                      necesidades.*
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
                      className="bg-[#E74C3C] px-3 hover:bg-[#C0392B] text-white border-none w-full sm:w-auto "
                      onClick={() => handlerStatusClaim("UNSOLVED")}
                      isLoading={isLoadingStatus.unsolved}
                      disabled={
                        claim?.status_order_claim_id === "CANCEL_ID" ||
                        claim?.status_order_claim_id === "UNSOLVED_ID" ||
                        !hasPassed48Hours(claim?.created_at)
                      }
                    >
                      Escalar con un administrador
                    </ButtonLigth>
                  </div>
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
