"use client"

import React, { useEffect, useRef, useState } from "react"
import ReviewProduct from "@modules/product-variant/components/product-review"
import Thumbnail from "@modules/products/components/thumbnail"
import { storeProductVariant } from "types/global"
import TableSeller from "../components/table-sellers"
import TableSellerDefault from "../components/table-sellers/seller_default"
import { Input, Button } from "@heroui/react"
import { useCart } from "medusa-react"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import Link from "next/link"
import { useCartDropdown } from "@lib/context/cart-dropdown-context"
import { formatPrice } from "@lib/util/formatPrice"

type ProductVariantTemplateProps = {
  product: storeProductVariant
  storeId?: string
}

interface Seller {
  store_variant_id: string
  store_id: string
  store_name: string
  email: string
  quantity: number
  price: number
 
  avatar: string
  parameters: {
    rating: number
    sales: number
  }
}

const ProductTemplate: React.FC<ProductVariantTemplateProps> = ({
  product,
  storeId,
}) => {
  const { addItem, existingVariant } = useCartGudfy()
  const storeReference = storeId
    ? product.sellers.find((seller) => seller.store_id == storeId)
    : product.sellers[0]
  const [selectedSeller, setSelectedSeller] = useState<Seller>(
    storeReference || product.sellers[0]
  )
  const [price, setPrice] = useState<number>()
  const [amount, setAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const isDraft = product.status === "draft"

  const { open } = useCartDropdown()

  const handlerPrice = (amountvalue: number) => {
    setPrice(
      
        selectedSeller ? formatPrice(selectedSeller.price * amountvalue) : 0
    
    )
  }

  const handlerAmount = (value: string) => {
    const numberAmount = parseInt(value)
    if (numberAmount > selectedSeller.quantity) {
      setAmount(selectedSeller.quantity)
      handlerPrice(selectedSeller.quantity)
    } else if (numberAmount < 0) {
      setAmount(0)
      handlerPrice(0)
    } else {
      setAmount(numberAmount)
      handlerPrice(numberAmount)
    }
  }

 

  const handlerAddCart = async () => {
    if (!isLoading && amount) {
      setIsLoading(true)
      try {
        await addItem(
          {
            description: product.title,
            id: product.id,
            thumbnail: product.thumbnail,
            price: selectedSeller.price,
            title: product.title,
          },
          amount,
          selectedSeller.store_variant_id
        )
        open()
      } catch (error) {
        console.error("Error adding item to cart:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    setAmount(1)
    handlerPrice(1)
  }, [selectedSeller])

  return (
    <div className="w-full">
      {isDraft ? (
        <div className="w-full bg-amber-50 border border-amber-300 p-8 rounded-md flex flex-col items-center justify-center min-h-[400px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-amber-800 mb-2">Producto Deshabilitado</h2>
          <p className="text-amber-700 text-center max-w-md">Este producto se encuentra actualmente deshabilitado y no está disponible para su visualización o compra.</p>
          <Link href="/" className="mt-6 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors">
            Volver a inicio
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3">
            <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative mt-10">
              <div className="col1 flex flex-col gap-y-8 w-full lg:pr-9 justify-center items-center">
                <Thumbnail thumbnail={product.thumbnail} size="medium" />
              </div>

              <div className="col2 flex flex-col gap-y-8 w-full lg:pr-9">
                <h3 className="text-3xl font-extrabold">{product.title}</h3>
                <p className="text-base-regular">{product.description}</p>
              </div>
            </div>

            <div className="flex w-full h-auto items-center">
              <div className="w-full p-10">
                <TableSeller
                  sellers={product.sellers}
                  selectedSeller={selectedSeller}
                  setSelectedSeller={setSelectedSeller}
                />
              </div>
            </div>

            <div className="content-container my-16 px-6 small:px-8 small:my-32">
              {/* <RelatedProducts product={product} /> */}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-[180px] col3 mt-[-35px] w-full small:max-w-[344px] medium:max-w-[400px] flex flex-col gap-y-8 lg:mr-10">
              <div id="product-info">
                <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
                  <div></div>
                </div>
              </div>

              <div className="border border-solid border-gray-200 p-5 rounded-[5px] shadow-lg">
                <TableSellerDefault
                  sellers={product.sellers}
                  selectedSeller={selectedSeller}
                  setSelectedSeller={setSelectedSeller}
                />

                {selectedSeller ? (
                  <div className="mt-10">
                    <Input
                      value={`${amount}`}
                      type="number"
                      label="Cantidad"
                      placeholder="Seleccione una cantidad"
                      labelPlacement="outside"
                      onChange={(e) => handlerAmount(e.target.value)}
                    />

                    <p className="bg-[#ececec] rounded-[10px] mt-6 p-2">
                      Precio: $ {formatPrice(price || 0)}
                    </p>
                  </div>
                ) : (
                  <p>Selecciona un Vendedor</p>
                )}
              </div>
              {existingVariant === selectedSeller.store_variant_id ? (
                <p className="text-red-700 text-sm">
                  Este vendedor ya ha sido seleccionado
                </p>
              ) : (
                <></>
              )}

              <Button
                isLoading={isLoading}
                disabled={(amount ? false : true) || isLoading}
                onPress={handlerAddCart}
                className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px] mb-[10px]"
              >
                Añadir al carrito
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductTemplate
