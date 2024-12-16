"use client"

import { useState, useEffect, useRef } from "react"
import React from "react"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalProps,
  Input,
} from "@nextui-org/react"
import { FaPlus, FaEye } from "react-icons/fa6"
import OrderRevie from "../order-review"
import { ChatBubble, PlayMiniSolid } from "@medusajs/icons"
import { Button as ButtonMedusa } from "@medusajs/ui"
import Link from "next/link"
import { getListOrders } from "@modules/account/actions/get-list-orders"
import { useMeCustomer } from "medusa-react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import { orderClaim, useOrderGudfy } from "@lib/context/order-context"
import ModalOrderComplete from "../order-status/complete"
import ModalOrderPending from "../order-status/pay-pending"
import ModalOrderCancel from "../order-status/cancel"
import ModalOrderFinished from "../order-status/finished"
import { getListClaimComments } from "@modules/account/actions/get-list-claim-comments"
import { postAddComment } from "@modules/account/actions/post-add-comment"
import { useSellerStoreGudfy } from "@lib/context/seller-store"
import { updateStatusClaim } from "@modules/account/actions/update-status-claim"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { updateStateNotification } from "@modules/account/actions/update-state-notification"
import io, { Socket } from "socket.io-client"
import Loader from "@lib/loader"
import { ChatIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"

type orders = {
  orders: order[]
}

interface Ticket {
  id: number
  status: "" | "Por pagar" | "Completado"
  orderNumber: string
  createdAt: string
}

const ClaimSellerTable: React.FC = () => {
  const { listOrderClaim, handlerListSellerOrderClaim, isLoadingClaim } =
    useOrderGudfy()
  const { storeSeller } = useSellerStoreGudfy()
  const [selectOrderClaim, setSelectOrderClaim] = useState<orderClaim>()
  const { notifications, handlerRetriverNotification, setNotifications } =
    useNotificationContext()
  const handleReset = () => {
    handlerListSellerOrderClaim(storeSeller?.id || " ")
  }
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
    getListClaimComments(claim?.id).then((e) => {
      setComments(e)
      onOpen()
    })
  }

  useEffect(() => {
    handlerListSellerOrderClaim(storeSeller?.id || " ")
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        {/* <div className="flex justify-between mb-4">
          <div></div>
          <div className="">
            ¿Necesitas ayuda? Crea un ticket:
            <div className="flex justify-center mt-5">
              <ButtonMedusa
                className="text-white bg-[#402e72]  hover:bg-[#2c1f57] rounded-[5px]"
                onClick={onOpen}
              >
                <FaPlus />
                Nuevo ticket
              </ButtonMedusa>
            </div>
          </div>
        </div> */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 text-left">Estado del reclamo</th>
                <th className="py-2 text-left">Orden número</th>
                <th className="py-2 text-left">Detalles del producto</th>
                <th className="py-2 text-left">Cliente que reclama</th>
                <th className="py-2 text-left">Fecha y hora de creación</th>
                <th className="py-2 text-left">Chat</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingClaim ? (
                listOrderClaim?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td>
                      {claim.status_order_claim_id === "OPEN_ID" ? (
                        <div className="mr-2 p-3 bg-blue-200 rounded-md">
                          En proceso
                        </div>
                      ) : claim.status_order_claim_id === "CANCEL_ID" ? (
                        <div className="mr-2 p-3 bg-red-200 rounded-md">
                          Cerrada
                        </div>
                      ) : claim.status_order_claim_id === "UNSOLVED_ID" ? (
                        <div className="mr-2 p-3 bg-orange-200 rounded-md">
                          Escalada al administrador
                        </div>
                      ) : (
                        claim.status_order_claim_id === "SOLVED_ID" && (
                          <div className="mr-2 p-3 bg-green-200 rounded-md">
                            Cerrada
                          </div>
                        )
                      )}
                    </td>
                    <td className="py-2">
                      {handlerOrderNumber(claim.number_order)}
                    </td>
                    <td className="py-2">
                      <div>
                        <h3 className="font-semibold">{claim.product_name}</h3>
                        <p className="text-xs">Cantidad: {claim.quantity}</p>
                        <p className="text-xs">por: {claim.store_name}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      {`${claim.customer_name} ${claim.customer_last_name}`}
                      <p className="text-xs">{claim.customer_email}</p>
                    </td>
                    <td className="py-2">
                      {handlerformatDate(claim.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        {notifications.map((n) => {
                          if (
                            n.notification_type_id === "NOTI_CLAIM_SELLER_ID" &&
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
                <Loader />
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
}

const ModalClaimComment = ({
  setComments,
  comments,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalClaimComment) => {
  const [newComment, setNewComment] = useState<string>()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)
  const { customer } = useMeCustomer()
  const handlerSubmitComment = () => {
    const dataComment = {
      comment: newComment,
      order_claim_id: comments?.[0].order_claim_id,
      customer_id: customer?.id,
      comment_owner_id: "COMMENT_STORE_ID",
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
                comment_owner_id: "COMMENT_STORE_ID",
              },
            ]
          : [
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_STORE_ID",
              },
            ]
      })
    })
  }

  const handlerStatusClaim = (status: string) => {
    updateStatusClaim(comments?.[0].order_claim_id || " ", status).then(() => {
      handleReset()
      onOpenChange()
    })
  }

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")

    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
      // Si la notificación es para el cliente correcto, agregarla a la lista

      if (data.order_claim_id === comments?.[0].order_claim_id)
        getListClaimComments(comments?.[0].order_claim_id).then((e) => {
          setComments(e)
        })
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect() // Desconectar el socket cuando el componente se desmonta
    }
  }, [comments?.[0].order_claim_id])

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
              <h2 className="text-center text-lg font-semibold">Resolución de reclamos</h2>
            </ModalHeader>
            <ModalBody className="bg-gray-100 px-8 py-4 overflow-y-auto h-[60vh]">
              <div className="flex flex-col gap-2">
                {comments?.map((comment, index) => (
                  <div
                    key={index}
                    className={`flex w-full transition-transform duration-300 ease-in-out ${
                      comment.comment_owner_id === "COMMENT_STORE_ID"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 shadow-md text-sm ${
                        comment.comment_owner_id === "COMMENT_STORE_ID"
                          ? "bg-blue-400 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl "
                          : "bg-gray-200 text-gray-900 rounded-br-xl rounded-tr-xl rounded-tl-xl"
                      }`}
                    >
                      <p className="mb-1 text-xs font-bold">
                        {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                          ? "Cliente"
                          : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "Admin Gudfy"
                          : "Tienda"}
                      </p>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-slate-200 bg-gray-50 py-3 px-4 rounded-b-2xl">
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
                  <button
                    onClick={handlerSubmitComment}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h11M3 14h7m-7 4h11m-4 4l6-8m-6 8l-6-8"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  *Si encuentras que este asunto no puede ser resuelto por ti, tienes la posibilidad de escalarlo al administrador.*
                  <div className="flex justify-center gap-2 mt-2">
                    <ButtonLigth
                      className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none w-full sm:w-auto"
                      onClick={() => handlerStatusClaim("UNSOLVED")}
                      isLoading={isLoadingStatus}
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

export default ClaimSellerTable
