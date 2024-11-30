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

type orders = {
  orders: order[]
}

const ClaimTable: React.FC = () => {
  const { listOrderClaim, handlerListOrderClaim, isLoadingClaim } =
    useOrderGudfy()
  const [selectOrderClaim, setSelectOrderClaim] = useState<orderClaim>()
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
      <div className="mb-8 flex flex-col gap-y-4 ">
        <h1 className="text-2xl-semi">Mis Reclamos</h1>
      </div>
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
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Estado del reclamo
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Numero de Orden
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Detalles del Producto
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Fecha y hora de Creación
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingClaim ? (
                listOrderClaim?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td>
                      {claim.status_order_claim_id === "OPEN_ID" ? (
                        <div className="mx-1 p-3 bg-blue-200 rounded-md">
                          En proceso
                        </div>
                      ) : claim.status_order_claim_id === "CANCEL_ID" ? (
                        <div className="mx-1 p-3 bg-green-200 rounded-md">
                          Cerrada
                        </div>
                      ) : claim.status_order_claim_id === "UNSOLVED_ID" ? (
                        <div className="mx-1 p-3 bg-orange-200 rounded-md">
                          Escalada al Administrador
                        </div>
                      ) : (
                        claim.status_order_claim_id === "SOLVED_ID" && (
                          <div className="mx-1 p-2 bg-green-200 rounded-md">
                            Cerrada
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
                      <ButtonMedusa
                        className="bg-[#1f0146cf] border-none shadow-none hover:bg-blue-gf hover:text-white text-slate-200 rounded-[5px]"
                        onClick={() => {
                          handlerSelectClaimOrder(claim)
                        }}
                      >
                        <ChatBubble />{" "}
                      </ButtonMedusa>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="p-6"><Loader/></div>
                
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
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Conversación con la tienda de {claim?.store_name}
            </ModalHeader>
            <ModalBody className=" justify-end  min-h-[400px] ">
              {comments?.map((comment) => (
                <div
                  className={`flex w-full   ${
                    comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="my-1 px-3 py-1 bg-slate-200 border rounded-[10px]">
                    <p className="text-xs">
                      {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                        ? "Yo"
                        : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                        ? "Admin Gudfy"
                        : "Tienda"}
                    </p>
                    {comment.comment}
                  </div>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <div className="w-full">
                <div className=" flex w-full">
                  <Input
                    value={newComment}
                    size="sm"
                    className="border rounded-[10px]"
                    radius="sm"
                    endContent={
                      <ButtonMedusa
                        onClick={handlerSubmitComment}
                        variant="transparent"
                        className="rounded-full border border-blue-gf bg-transparent hover:bg-slate-300"
                      >
                        <PlayMiniSolid color="#1f0046" />
                      </ButtonMedusa>
                    }
                    onValueChange={setNewComment}
                  />{" "}
                </div>
                <div className="my-4 mx-2">
                  <p className="text-sm">
                    {" "}
                    Estimado cliente, tiene varias opciones disponibles para
                    proceder con su reclamación. Por favor, actúe según su
                    preferencia para avanzar en el proceso.
                  </p>
                  <div className="flex gap-2  mt-2">
                    {/* <Button
                      className="bg-green-600 text-white"
                      onClick={() => handlerStatusClaim("SOLVED")}
                      isLoading={isLoadingStatus.solved}
                    >
                      Resolver
                    </Button> */}
                    <Button
                      className="bg-green-600 text-white"
                      onClick={() => handlerStatusClaim("CANCEL")}
                      isLoading={isLoadingStatus.cancel}
                    >
                      Cerrar Reclamo
                    </Button>
                    <Button
                      className="bg-orange-600 text-white"
                      onClick={() => handlerStatusClaim("UNSOLVED")}
                      isLoading={isLoadingStatus.unsolved}
                      disabled={!hasPassed48Hours(claim?.created_at)}
                    >
                      Escalar a administrador
                    </Button>
                  </div>
                </div>
              </div>
              {/* <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ClaimTable
