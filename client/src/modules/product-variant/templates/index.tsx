"use client"

import { ProductProvider } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import React, { useEffect, useRef, useState } from "react"
// import ImageGallery from "../components/image-gallary"
// import MobileActions from "../components/mobile-actions"
import ReviewProduct from "@modules/product-variant/components/product-review"
import Thumbnail from "@modules/products/components/thumbnail"
import { storeProductVariant } from "types/global"
import TableSeller from "../components/table-sellers"
import { Input, Button } from "@nextui-org/react"

type ProductVariantTemplateProps = {
  product: storeProductVariant
}
interface Seller {
  store_id: string
  store_name: string
  email: string
  amount: number
  price: number
}

const ProductTemplate: React.FC<ProductVariantTemplateProps> = ({
  product,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<Seller>(
    product.sellers[0]
  )
  const [price, setPrice] = useState<number>()
  const [amount, setAmount] = useState<number>(1)

  const handlerPrice = (amountvalue: number) => {
    setPrice(selectedSeller ? selectedSeller.price * amountvalue : 0)
  }
  const handlerAmount = (value: string) => {
    const numberAmount = parseInt(value)
    if (numberAmount > selectedSeller.amount) {
      setAmount(selectedSeller.amount)
      handlerPrice(selectedSeller.amount)
    } else if (numberAmount < 0) {
      setAmount(0)
      handlerPrice(0)
    } else {
      setAmount(numberAmount)
      handlerPrice(numberAmount)
    }
  }
  useEffect(() => {
    setAmount(1)
    handlerPrice(1)
  }, [selectedSeller])
  return (
    <div>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col gap-y-8 w-full pr-9 justify-center items-center ">
          <h3 className="text-3xl font-extrabold">{product.title}</h3>
          <Thumbnail thumbnail={product.thumbnail} size="medium" />
          {/* <ImageGallery images={product?.images || []} />
           */}
          <div className="flex w-full h-auto border-t-1 border-solid items-center justify-center">
            {/* <div className="w-[50%] p-5 flex flex-col justify-center items-center">
              <ReviewProduct product={product} />
            </div> */}
            <div className="w-[80%] p-5">
              <TableSeller
                sellers={product.sellers}
                selectedSeller={selectedSeller}
                setSelectedSeller={setSelectedSeller}
              />
            </div>
          </div>
        </div>
        <div className="small:sticky small:top-20 w-full py-8 small:py-0 small:max-w-[344px] medium:max-w-[400px] flex flex-col gap-y-12 mr-10">
          <div id="product-info">
            <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
              <div>
                <h3 className="text-xl-regular">{product.title}</h3>
                <p className="text-base-regular">{product.description}</p>
              </div>
            </div>
          </div>
          {selectedSeller ? (
            <>
              <Input
                value={`${amount}`}
                type="number"
                label="Cantidad"
                placeholder="Seleccione una cantidad"
                labelPlacement="outside"
                onChange={(e) => handlerAmount(e.target.value)}
              />
              <p>Precio: $ {price || 0}</p>
            </>
          ) : (
            <p>Selecciona un Vendedor</p>
          )}
          {/* <ProductInfo product={product} />
          <ProductTabs product={product} />  */}
          <Button
            disabled={amount ? false : true}
            onPress={() => {}}
            className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px]"
          >
            Añadir al Carrito
          </Button>
        </div>
      </div>
      <div className="content-container my-16 px-6 small:px-8 small:my-32">
        {/* <RelatedProducts product={product} /> */}
      </div>
      {/* <MobileActions product={product} show={!inView} /> */}
    </div>
  )
}

export default ProductTemplate
