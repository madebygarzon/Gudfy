import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react"
import Link from "next/link"
import Image from "next/image"
import { order, useOrderGudfy } from "@lib/context/order-context"
import Timer from "@lib/util/timer-order"
import Button from "@modules/common/components/button"
import ArrowLeft from "@modules/common/icons/arrow-left"
import ButtonLigth from "@modules/common/components/button_light"
import io, { Socket } from "socket.io-client"

type TransactionDetailsProps = {
  data?: dataPay
  currentOrder?: order | null
}

type dataPay = {
  nextStepContent: string
  reference: string
  status: string
  orderAmount: string
  orderCurrency: string
  orderNo: string
  coinpal?: string
}

const CoinPalPayment: React.FC<TransactionDetailsProps> = ({
  data,
  currentOrder,
}) => {
  if (!data) return <></>

  const {
    nextStepContent,
    reference,
    status,
    orderAmount,
    orderCurrency,
    orderNo,
  } = data

  const [orderCancel, setOrderCancel] = useState<boolean>(false)
  const [successPay, setSuccessPay] = useState<boolean>(status === "completed")
  const [socket, setSocket] = useState<Socket | null>(null)

  const { handlerOrderCancel } = useOrderGudfy()

  const hanclerOrderCancelController = () => {
    handlerOrderCancel(currentOrder?.id || " ").then(() => {
      setOrderCancel(true)
    })
  }
 
  useEffect(() => {
    if (data?.nextStepContent?.startsWith("http")) {
      window.open(data.nextStepContent ?? data.coinpal, "_blank", "noopener,noreferrer")
    }
  }, [data?.nextStepContent])

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")

    socketIo.on("success_pay_order", (data: { order_id: string }) => {
      if (data.order_id === currentOrder?.id) setSuccessPay(true)
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [currentOrder])

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-5 mb-10">
      <CardHeader>
        <div className="p-8 bg-white rounded-lg shadow-lg w-full text-gray-800">
          {successPay ? (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-center text-2xl mt-2 font-bold">
                <strong> ¡Su compra se realizó con éxito! </strong>
                <p>Para ver su compra diríjase a la sección de mis pedidos</p>
              </h2>
              <Link href={"/account/orders"}>
                <ButtonLigth className="bg-lila-gf hover:bg-[#C0392B] text-white border-none">
                  Ir a mis órdenes
                </ButtonLigth>
              </Link>
            </div>
          ) : (
            <>
              {orderCancel ? (
                <></>
              ) : (
                <>
                  <h2 className="text-center text-2xl mt-2 font-bold">
                    <strong> ¡Gracias por tu pedido! </strong>
                  </h2>
                </>
              )}
            </>
          )}

          {orderCancel ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h2 className="text-center text-2xl mt-2 mb-4">
                Orden {currentOrder?.id}{" "}
                <span className="font-bold">cancelada</span>
              </h2>
              <Link href={"/"}>
                <ButtonLigth className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none">
                  Volver
                </ButtonLigth>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-base mb-4">
                Total a pagar:{" "}
                <span className="font-bold">
                  {orderAmount ?? currentOrder?.total_price} {orderCurrency ?? "USDT"}
                </span>
              </p>
            </>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {data?.coinpal? (
          <div className="rounded-lg shadow-lg">
            <div className="">
              <div className="p-8 bg-white w-full text-gray-800">
                <div className="flex mb-1 gap-14 w-full">
                  <div>
                  <p className="text-sm text-gray-500">NÚMERO DE PEDIDO:</p>
                  <strong>{currentOrder?.id}</strong>
                  </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
               {orderCancel || successPay ? <></>: <Link href={data.coinpal}>
                  <ButtonLigth className="bg-blue-gf hover:bg-lila-gf text-white border-none">Continuar con el pago</ButtonLigth>
                  </Link>} <div className="w-full flex flex-col justify-center items-center">
                  
                </div>
            </div>
          </div>
          <div className="p-4">
            {orderCancel || successPay ? (
              <></>
            ) : (
              <>
                <p className="text-center text-xs mb-4">
                  Siga las instrucciones proporcionadas para completar su pago.
                </p>
              </>
            )}
          </div>
        </div> ): ( <div className="rounded-lg shadow-lg">
            <div className="">
              <div className="p-8 bg-white w-full text-gray-800">
                <div className="flex mb-1 gap-14 w-full">
                  <div>
                  <p className="text-sm text-gray-500">NÚMERO DE PEDIDO:</p>
                  <strong>{currentOrder?.id}</strong>
                  <p className="text-sm text-gray-500">REFERENCIA DE PAGO:</p>
                  <strong>{reference}</strong>
                </div>

                <div>
                  <p className="text-sm text-gray-500">MONTO:</p>
                  <strong>
                    {orderAmount} {orderCurrency}
                  </strong>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-sm text-gray-400">ESTADO:</p>
                <strong>{status}</strong>
              </div>
            </div>

            <div>
              {successPay || orderCancel ? (
                <></>
              ) : (
                <div className="w-full flex flex-col justify-center items-center">
                  <Link href={nextStepContent}>
                  <ButtonLigth className="bg-blue-gf hover:bg-lila-gf text-white border-none">Continuar con el pago</ButtonLigth>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            {orderCancel || successPay ? (
              <></>
            ) : (
              <>
                <p className="text-center text-xs mb-4">
                  Siga las instrucciones proporcionadas para completar su pago.
                </p>
              </>
            )}
          </div>
        </div>)}
      </CardBody>
      <CardFooter>
        {orderCancel || successPay ? (
          <></>
        ) : (
          <div className="p-2 w-full -mt-6 bg-white text-center">
            <div className="text-gray-600 mb-2">
              Tiempo restante para completar el pago
            </div>
            <div className="text-4xl font-semibold mb-2">
              {currentOrder?.created_at && (
                <Timer creationTime={currentOrder.created_at} />
              )}
            </div>
            <div className="text-gray-500 mb-4">
              <span>Minutos</span> : <span>Segundos</span>
            </div>
            <div className="flex justify-center gap-2">
              <ButtonLigth
                onClick={hanclerOrderCancelController}
                className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
              >
                Cancelar pedido
              </ButtonLigth>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default CoinPalPayment
