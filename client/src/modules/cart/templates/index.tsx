"use client"

import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import DiscountCode from "@modules/checkout/components/discount-code"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"
import { useCart, useMeCustomer } from "medusa-react"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"
import Link from "next/link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { TaskProgressIndicatorCart } from "../../progress/index"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import { useState } from "react"

const CartTemplate = () => {
  const { cart } = useCart()
  const { customer, isLoading } = useMeCustomer()
  const { items } = useCartGudfy()
  const [modifyProduct, setModifyProduct] = useState<string[]>([])

  // if (isLoading) {
  //   console.log("entra al if")
  //   return <SkeletonCartPage />
  // }

  return (
    <div className="bg-gray-50 pb-12">
      <div className="h-16 bg-white">
        <nav className="flex items-center h-full justify-between content-container">
          <Link
            href="/cart"
            className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase flex-1 basis-0"
          >
            <>
              <span className="mt-px block small:hidden">Back</span>
            </>
          </Link>
          <TaskProgressIndicatorCart />

          <div className="flex-1 basis-0" />
        </nav>
      </div>

      <div className="content-container pt-12">
        {items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_460px] gap-x-8 ">
            <div className="flex flex-col bg-white p-6 gap-y-6 max-w-[80%]">
              {!customer && <SignInPrompt />}
              <ItemsTemplate items={items} modifyProduct={modifyProduct} />
            </div>
            <div className="w relative">
              <div className="flex flex-col gap-y-8 sticky top-36 mr-8">
                <div className="bg-white p-6">
                  <Summary items={items} setModifyProduct={setModifyProduct} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {!customer && <SignInPrompt />}
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
