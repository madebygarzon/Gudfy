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

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <Nav />
      <div className="bg-gray-100 relative small:min-h-screen">
        {/* Barra superior */}
        <div className="h-16 bg-white">
          <nav className="flex items-center h-full justify-between content-container px-4 small:px-8">
            {/* Enlace "Volver al carrito" */}
            <Link
              href="/cart"
              className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase flex-1 basis-0"
            >
              <>
                <ChevronDown className="rotate-90" size={16} />
                <span className="mt-px hidden small:block">
                  Volver al carrito
                </span>
                <span className="mt-px block small:hidden">Volver</span>
              </>
            </Link>

            {/* Indicador de progreso */}
            <TaskProgressIndicatorCheckout />

            {/* Espacio vacío para alinear */}
            <div className="flex-1 basis-0" />
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="relative">
          <CheckoutLoader />
          <div className="w-full mt-6 small:mt-10 px-4 small:px-8">
            <CheckoutForm />
          </div>
        </div>
      </div>
      <Footer />
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
