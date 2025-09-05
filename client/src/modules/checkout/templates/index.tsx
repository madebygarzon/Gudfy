"use client"
import { CheckoutProvider } from "@lib/context/checkout-context"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Link from "next/link"
import CheckoutLoader from "../components/checkout-loader"
import CheckoutForm from "./checkot-form-gudfy"
import CheckoutSummary from "./checkout-summary"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { TaskProgressIndicatorCheckout } from "../../progress/index"
import { useOrderGudfy } from "@lib/context/order-context"
import Timer from "@lib/util/timer-order"
import { useEffect, useState } from "react"
import ButtonLigth from "@modules/common/components/button_light"

const CheckoutTemplate = ({ orderId }: { orderId: string | undefined }) => {

  const [orderCancel, setOrderCancel] = useState<boolean>(false)

  const {currentOrder} = useOrderGudfy()

  console.log("currentOrder",currentOrder)

  const hanclerOrderCancelController = () => {
    setOrderCancel(true)
  }

  

  return (
    <CheckoutProvider>
      <Nav />
      <div className="bg-gray-100 relative small:min-h-screen">
        {/* Barra superior */}
        <div className="h-16 bg-white">
          <nav className=" items-center h-full px-4 small:px-8">
            {/* Enlace "Volver al carrito" */}
            <Link
              href="/cart"
              className="w-[50%] text-small-semi text-gray-700 flex items-center gap-x-2 uppercase  mt-2"
            >
              <>
                <ChevronDown className="rotate-90" size={16} />
                <span className="mt-px hidden small:block">
                  Volver al carrito
                </span>
                <span className="mt-px block small:hidden text-xs md:text-sm">Volver</span>
              </>
            </Link>

            {/* Indicador de progreso */}
            
            {currentOrder?.created_at && (
              <div className="flex-1 text-center -mt-2  ">
                <div className="flex flex-col small:flex-row items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl">
                  <span className="whitespace-nowrap">Tiempo para cancelar:</span>
                  <div className="flex items-center">
                    <strong className="font-bold mx-1 small:mx-2 text-xs sm:text-sm md:text-2xl hidden small:inline">{currentOrder.id}</strong>
                    <span className="text-red-500 font-bold uppercase md:text-2xl">
                      <Timer 
                        creationTime={currentOrder.created_at} 
                        hanclerOrderCancelController={hanclerOrderCancelController}
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}

            
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="relative">
          <CheckoutLoader />
          <div className="w-full mt-6 small:mt-10 px-4 small:px-8">
            {orderCancel ? (
              <div className=" bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto w-full h-full flex flex-col justify-center items-center mt-10">
              <h2 className="text-center text-2xl mt-2 mb-4">
              su orden se ha cancelado por tiempo de espera porfavor vuelva a ordenar
              N° {currentOrder?.id}{" "}
                <span className="font-bold">cancelada</span>
              </h2>
              <Link href={"/"}>
                <ButtonLigth className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none">
                  Volver
                </ButtonLigth>
              </Link>
            </div>
            ) : (
              <CheckoutForm orderId={orderId} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
