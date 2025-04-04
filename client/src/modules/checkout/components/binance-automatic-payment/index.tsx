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
  data?: {
    currency: string
    totalFee: string
    fiatCurrency: string
    fiatAmount: string
    prepayId: string
    terminalType: string
    expireTime: number
    qrcodeLink: string
    qrContent: string
    checkoutUrl: string
    deeplink: string
    universalUrl: string
  }
  currentOrder?: order | null
}

const BinanceAutomaticPayment: React.FC<TransactionDetailsProps> = ({
  data,
  currentOrder,
}) => {
  if (!data) return <></>
  const {
    currency,
    totalFee,
    fiatCurrency,
    fiatAmount,
    prepayId,
    terminalType,
    expireTime,
    qrcodeLink,
    qrContent,
    checkoutUrl,
    deeplink,
    universalUrl,
  } = data

  const expirationDate = new Date(expireTime).toLocaleString()
  const [orderCancel, setOrderCancel] = useState<boolean>(false)
  const [successPay, setSuccessPay] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const { handlerOrderCancel } = useOrderGudfy()

  const hanclerOrderCancelController = () => {
    handlerOrderCancel(currentOrder?.id || " ").then(() => {
      setOrderCancel(true)
    })
  }

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")
      
    socketIo.on("success_pay_order", (data: { order_id: string }) => {
      // Si la notificación es para el cliente correcto, agregarla a la lista

      if (data.order_id === currentOrder?.id) setSuccessPay(true)
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect() // Desconectar el socket cuando el componente se desmonta
    }
  }, [currentOrder])

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-5 mb-10">
      <CardHeader>
        <div className="p-8 bg-white rounded-lg shadow-lg w-full text-gray-800">
          {successPay ? (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-center text-2xl mt-2 font-bold">
                <strong> ¡Su compra se Realizo con exito ! </strong>
                <p>
                  para ver su compra redirigase a la seccion de mis pedidos{" "}
                </p>
              </h2>
              <Link href={"/account/orders"}>
                <ButtonLigth className="bg-lila-gf hover:bg-[#C0392B] text-white border-none">
                  ir a mis ordenes
                </ButtonLigth>
              </Link>
            </div>
          ) : (
            <>
              {" "}
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
              <p className="text-center  text-base mb-4">
                Total a pagar:{" "}
                <span className="font-bold">{totalFee} USDT</span>
              </p>
            </>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="rounded-lg shadow-lg">
          <div className="flex justify-center">
            <div className="p-8 bg-white w-full text-gray-800">
              <div className="flex  mb-1 gap-14 w-full">
                <div>
                  <p className="text-sm  text-gray-500">NÚMERO DE PEDIDO:</p>
                  <strong>{currentOrder?.id}</strong>
                  <p className="text-sm  text-gray-500">REFERENCIA DE PAGO:</p>
                  <strong>{prepayId}</strong>
                </div>

                <div>
                  <p className="text-sm  text-gray-500">FECHA:</p>
                  <strong>{expirationDate}</strong>
                </div>

                <div>
                  <p className="text-sm  text-gray-500">TOTAL:</p>
                  <strong>{totalFee}</strong>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-sm  text-gray-400">MÉTODO DE PAGO:</p>
                <strong>Binance Pay Entrega Automática</strong>
              </div>
            </div>

            <div>
              {orderCancel || successPay ? (
                <></>
              ) : (
                <div className="w-full flex flex-col justify-center items-center">
                  <Image
                    src={qrcodeLink}
                    alt="QR Code"
                    width={300}
                    height={300}
                  />
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
                  Escanea el código QR utilizando la aplicación de Binance para
                  completar tu pago. Alternativamente, puedes tomar una captura
                  de pantalla del código.
                </p>
              </>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter>
        {orderCancel || successPay ? (
          <></>
        ) : (
          <div className="p-2 w-full -mt-6 bg-white  text-center">
            {/* <Link
              className="text-blue-500 hover:text-blue-700"
              href={checkoutUrl}
            >
              Pagar en el navegador
            </Link> */}
            <div className="text-gray-600 mb-2">
              Tiempo restante para completar el pago
            </div>
            <div className="text-4xl font-semibold mb-2">
              {/* {time.minutes < 10 ? "0" : ""}
            {time.minutes} : {time.seconds < 10 ? "0" : ""}
            {time.seconds} */}
              {currentOrder?.created_at && (
                <Timer creationTime={currentOrder.created_at} />
              )}
            </div>
            <div className="text-gray-500 mb-4">
              <span>Minutos</span> : <span>Segundos</span>
            </div>
            <div className="flex justify-center gap-2">
              <Link href={checkoutUrl}>
                <ButtonLigth className="bg-[#28A745] hover:bg-[#218838] text-white border-none">
                  Pagar en el navegador
                </ButtonLigth>
              </Link>

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

export default BinanceAutomaticPayment
