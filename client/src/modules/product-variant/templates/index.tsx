"use client"

import React, { useEffect, useRef, useState } from "react"
// import ImageGallery from "../components/image-gallary"
// import MobileActions from "../components/mobile-actions"
import ReviewProduct from "@modules/product-variant/components/product-review"
import Thumbnail from "@modules/products/components/thumbnail"
import { storeProductVariant } from "types/global"
import TableSeller from "../components/table-sellers"
import TableSellerDefault from "../components/table-sellers/seller_default"
import { Input, Button } from "@nextui-org/react"
import { useCart } from "medusa-react"

import { useCartGudfy } from "@lib/context/cart-gudfy"
import Link from "next/link"
import { useCartDropdown } from "@lib/context/cart-dropdown-context"

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

  const { open } = useCartDropdown()

  const handlerPrice = (amountvalue: number) => {
    setPrice(
      roundToTwoDecimals(
        selectedSeller ? selectedSeller.price * amountvalue : 0
      )
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

  const roundToTwoDecimals = (num: number) => {
    let tempNum = num * 1000
    tempNum = Math.round(tempNum)
    tempNum = tempNum / 10
    return tempNum / 100
  }

  const handlerAddCart = () => {
    addItem(
      {
        description: product.title,
        id: product.id,
        thumbnail: product.thumbnail,
        price: selectedSeller.price,
        title: product.title,
      },
      amount,
      selectedSeller.store_variant_id
    ).then(() => {
      open()
    })
  }
  useEffect(() => {
    setAmount(1)
    handlerPrice(1)
  }, [selectedSeller])

  return (
    <div className="w-full flex">
      <div className="w-2/3">
        <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative mt-10">
          <div className="col1 flex flex-col gap-y-8 w-full pr-9 justify-center items-center">
            <Thumbnail thumbnail={product.thumbnail} size="medium" />
            {/* <ImageGallery images={product?.images || []} /> */}
          </div>

          <div className="col2 flex flex-col gap-y-8 w-full pr-9">
            <h3 className="text-3xl font-extrabold">{product.title}</h3>
            <p className="text-base-regular">{product.description}</p>
          </div>
        </div>

        <div
          className="flex w-full  h-auto  items-center"
          // id="list-sellers"
        >
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
        {/* <MobileActions product={product} show={!inView} /> */}
      </div>

      <div className="w-1/3">
        <div className="sticky top-[180px] col3 mt-[-35px] w-full small:max-w-[344px] medium:max-w-[400px] flex flex-col gap-y-8 mr-10">
          <div id="product-info">
            <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
              <div></div>
            </div>
          </div>

          <div className="  border border-solid border-gray-200 p-5 rounded-[5px] shadow-lg">
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
                  Precio: $ {price || 0}
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
            disabled={amount ? false : true}
            onPress={handlerAddCart}
            className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px] mb-[10px] "
          >
            Añadir al Carrito
          </Button>
          {/* <Link href="/cart" passHref className="w-full flex justify-end  ">
            <Button className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px]  ">
              Ir al Carrito
            </Button>
          </Link> */}

          {/* <a className ="mb-[80px]" href="#list-sellers">
            <span className="text-[#402e72] text-sm font-bold">
              Ver más vendedores de este producto
            </span>
          </a> */}
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
