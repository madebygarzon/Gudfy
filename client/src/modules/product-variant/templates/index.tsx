"use client"

import { ProductProvider } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import React, { useEffect, useRef, useState } from "react"
// import ImageGallery from "../components/image-gallary"
// import MobileActions from "../components/mobile-actions"
import ReviewProduct from "@modules/products/components/product-review"
import Thumbnail from "@modules/products/components/thumbnail"
import { storeProductVariant } from "types/global"
import TableSeller from "../components/table-sellers"

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
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [price, setPrice] = useState<number>()
  const [amount, setAmount] = useState<number>(1)

  const handlerPrice = () => {
    setPrice(selectedSeller ? selectedSeller.price * amount : 0)
  }
  useEffect(() => {
    handlerPrice()
  }, [selectedSeller])
  return (
    <div>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col gap-y-8 w-full pr-9">
          <Thumbnail thumbnail={product.thumbnail} size="medium" />
          {/* <ImageGallery images={product?.images || []} />
           */}
          <div className="flex w-full h-auto">
            <div className="w-[50%] p-5 flex flex-col justify-center items-center">
              <ReviewProduct product={product} />
            </div>
            <div className="w-[50%] p-5">
              <TableSeller
                sellers={product.sellers}
                selectedSeller={selectedSeller}
                setSelectedSeller={setSelectedSeller}
              />
            </div>
          </div>
        </div>
        <div className="small:sticky small:top-20 w-full py-8 small:py-0 small:max-w-[344px] medium:max-w-[400px] flex flex-col gap-y-12">
          <div id="product-info">
            <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
              <div>
                <h3 className="text-xl-regular">{product.title}</h3>
                <p className="text-base-regular">{product.description}</p>
              </div>
            </div>
          </div>
          {selectedSeller ? (
            <p>Precio: $ {price}</p>
          ) : (
            <p>Selecciona un Vendedor</p>
          )}
          {/* <ProductInfo product={product} />
          <ProductTabs product={product} />  */}
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
