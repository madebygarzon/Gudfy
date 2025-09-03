import React, { useState } from "react"
import Image from "next/image"
import { Button, Link } from "@heroui/react"
import { Label } from "@medusajs/ui"
import { orderDataForm } from "@lib/context/order-context"
import { handlerUpdateDataLastOrderWithManualPay } from "@modules/checkout/actions/post-add-order-whit-manual-pay"
import InputFile from "@modules/common/components/input-file"
import { useOrderGudfy } from "@lib/context/order-context"
import { useCartGudfy } from "@lib/context/cart-gudfy"

type UploadedFile = {
  file: File
  preview: string
}

const ManualBinancePay: React.FC<{
  dataForm: orderDataForm
  storeOrder?: string
}> = ({ dataForm, storeOrder }) => {
  const { cart, deleteCart } = useCartGudfy()
  const {currentOrder} = useOrderGudfy()
  const [uploadedImage, setUploadedImage] = useState<File | undefined>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  

  const handleSubmit = async () => {
    if (!uploadedImage) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", uploadedImage)
      formData.append(
        "dataForm",
        JSON.stringify({
          ...dataForm,
          pay_method_id: "manual_binance_pay",
        })
      )

      handlerUpdateDataLastOrderWithManualPay(formData, storeOrder || "").then(
        (res) => {
          if (res.success) {
            setIsSuccess(true)
            deleteCart()
          }
        }
      )
    } catch (error) {
      console.log("Error uploading payment proof:", error)
      alert("Error al subir el comprobante")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm">
      <h2 className="font-bold text-xl md:text-2xl text-center mb-6">
        Comprobante de Pago Binance Pay
      </h2>

      {isSuccess ? (
        <div className="mb-6 p-4  border border-lila-gf rounded-md text-center">
          <p className="text-green-700 font-medium text-lg mb-2">
            ¡Comprobante enviado correctamente!
          </p>
          <p className="text-green-600">
            Espera a que nuestro equipo de Gudfy compruebe tu transacción. Te
            notificaremos cuando sea verificada.
          </p>
          <Link href="/account/orders" className="mt-4">
            <Button color="primary" className="px-8 py-2 w-full bg-lila-gf">
              Mis Ordenes
            </Button>
          </Link>
        </div>
      ): <div className="flex flex-col md:flex-row md:gap-8">
      {/* Columna izquierda - Instrucciones y QR */}
      <div className="font-normal text-sm pb-5 md:w-1/2">
      {currentOrder && (
        <div className="mb-4 p-4 border rounded-md border-lila-gf font-bold text-xl">
        
        <p>Total a pagar: {currentOrder.total_price}</p>
        <p>Orden: {currentOrder.id}</p>

      </div>)}
        <p className="mb-4">
          Por favor use <strong>Binance Pay ID 40794517</strong> o escanee el
          código QR con su aplicación de Binance. Se debe subir el comprobante
          de pago a continuación, todos los pagos serán comprobados
          manualmente.
        </p>

        <div className="my-6 flex justify-center">
          <Image
            src="/pay/BinancePayId.webp"
            alt="Binance Pay ID 40794517"
            width={250}
            height={250}
            className="border border-gray-200 rounded-md"
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-blue-700 font-medium">Importante:</p>
          <p className="text-blue-700">
            Usa el ID exacto proporcionado y conserva el comprobante de pago
            en caso de cualquier inconveniente.
          </p>
        </div>
      </div>

      {/* Columna derecha - Formulario de subida */}
      <div className="font-normal text-sm pb-5 md:w-1/2">
        <div className="mb-4">
          <Label htmlFor="payment-proof" className="font-medium mb-2 block">
            Subir comprobante de pago *
          </Label>

          <InputFile
            type="Image"
            label="Subir comprobante de pago"
            setFile={setUploadedImage}
            alt="Comprobante de pago"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formatos aceptados: JPG, PNG, PDF (máx. 1MB)
          </p>
        </div>

        {uploadedImage && (
          <div className="mt-6 mb-6">
            <p className="font-medium text-sm mb-2">Vista previa:</p>
            <div className="relative w-full h-48 mx-auto border border-gray-200 rounded-md overflow-hidden">
              <Image
                src={URL.createObjectURL(uploadedImage)}
                alt="Vista previa del comprobante"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button
            color="primary"
            className="px-8 py-2 w-full bg-lila-gf"
            isDisabled={!uploadedImage || isUploading}
            isLoading={isUploading}
            onPress={handleSubmit}
          >
            {isUploading ? "Subiendo..." : "Enviar comprobante"}
          </Button>
        </div>
      </div>
    </div>}

      
    </div>
  )
}

export default ManualBinancePay
