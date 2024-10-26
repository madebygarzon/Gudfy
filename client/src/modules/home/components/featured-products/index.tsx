"use client"
import React, { useState, useEffect } from "react"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import Link from "next/dist/client/link"
import ButtonLigth from "@modules/common/components/button_light"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import { productVariant } from "types/global"

const FeaturedProducts = () => {
  const [products, setProducts] = useState<productVariant[]>([])

  useEffect(() => {
    getListProductVariantWithSellers().then((data) => {
      setProducts(data)
    })
  }, [])
  return (
    <>
      <div className="py-12">
        <div className="content-container py-12">
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

          <Link href="/store">
            <ButtonLigth className="block ml-auto mr-auto mt-8">
              Ver más
            </ButtonLigth>
          </Link>
        </div>
      </div>

      <div className="py-12 bg-[#EEEEEE] w-full mb-16">
        <div className="content-container py-12">
          <p className=" text-[#1F0054] text-[24px] font-black pb-5 w-[90%] ml-8">
            Productos digitales
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

          <Link href="/store">
            <ButtonLigth className="block ml-auto mr-auto mt-8">
              Ver más
            </ButtonLigth>
          </Link>
        </div>
      </div>
    </>
  )
}

export default FeaturedProducts
