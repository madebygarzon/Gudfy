import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react"
import Link from "next/link"
import Image from "next/image"
import { order, useOrderGudfy } from "@lib/context/order-context"
import Timer from "@lib/util/timer-order"
import Button from "@modules/common/components/button"
import ArrowLeft from "@modules/common/icons/arrow-left"
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

  const { handlerOrderCancel } = useOrderGudfy()

  const hanclerOrderCancelController = () => {
    handlerOrderCancel(currentOrder?.id || " ").then(() => {
      setOrderCancel(true)
    })
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-5 mb-10">
      <CardHeader>
        <div className="p-8 bg-white rounded-lg shadow-lg w-full text-gray-800">
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

          {orderCancel ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h3 className="my-10 text-2xl font-bold">
                Orden {currentOrder?.id} cancelada
              </h3>
              <Link href={"/"}>
                <Button className="flex gap-1">Volver</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-xl mb-4">
                <strong> Gracias por su pedido </strong>
              </p>
              <p className="text-start text-red-500 font-bold text-lg mb-4">
                Total a pagar: {totalFee} USDT
              </p>
            </>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {orderCancel ? (
          <></>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-[80%]">
              <p className="text-center mb-4">
                Escanea el siguiente código QR desde tu app para completar el
                pago, también puedes tomar una captura.
              </p>
              <div className="flex justify-center mb-4"></div>
              <p className="text-center">
                Escanee el siguiente código QR desde la aplicación Binance para
                completar el pago, también puede tomar una captura de pantalla.
              </p>
            </div>
            <Image src={qrcodeLink} alt="QR Code" width={300} height={300} />
          </div>
        )}
      </CardBody>
      <CardFooter>
        {orderCancel ? (
          <></>
        ) : (
          <div className="p-2 w-full -mt-6 bg-white  text-center">
            <div className="text-gray-400 mb-2">-- o --</div>
            <Link
              className="text-blue-500 hover:text-blue-700"
              href={checkoutUrl}
            >
              Pagar en el navegador
            </Link>
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
            <button
              onClick={hanclerOrderCancelController}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            >
              Cancelar pedido
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default BinanceAutomaticPayment
