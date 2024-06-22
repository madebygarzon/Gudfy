"use client"
import React, { useState, useEffect } from "react"
import { useFeaturedProductsQuery } from "@lib/hooks/use-layout-data"
import UnderlineLink from "@modules/common/components/underline-link"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import Link from "next/dist/client/link"
import ButtonLigth from "@modules/common/components/button_light"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import { productVariant } from "types/global"

const FeaturedProducts = () => {
  //const { data } = useFeaturedProductsQuery()
  const [products, setProducts] = useState<productVariant[]>([])

  useEffect(() => {
    getListProductVariantWithSellers().then((data) => {
      setProducts(data)
    })
  }, [])
  return (
    <div className="py-12">
      <div className="content-container py-12">
        {/*<div className="flex flex-col items-center text-center mb-16">
          <span className="text-base-regular text-gray-600 mb-6">
            Latest products
          </span>
          <p className="text-2xl-regular text-gray-9, 00 max-w-lg mb-4">
            Our newest styles are here to help you look your best.
          </p>
          <UnderlineLink href="/store">Explore products</UnderlineLink>
  </div>*/}
        <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%] ml-8">
          Juegos
        </p>
        <ul className="grid grid-cols-2 small:grid-cols-6 gap-x-6 gap-y-8">
          {products.length
            ? products.map((product) => (
                <li key={product.id}>
                  <ProductVariantPreview {...product} />
                </li>
              ))
            : Array.from(Array(4).keys()).map((i) => (
                <li key={i}>
                  <SkeletonProductPreview />
                </li>
              ))}
        </ul>
        <Link href="/">
          <ButtonLigth className="block ml-auto mr-auto mt-8">
            Ver más
          </ButtonLigth>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedProducts
