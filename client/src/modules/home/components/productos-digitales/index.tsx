"use client"
import React, { useState, useMemo, useEffect } from "react"
import { productVariant } from "types/global"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import SkeletonProductStore from "@modules/skeletons/components/skeleton-store"
import { useInView } from "react-intersection-observer"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import { Image } from "@nextui-org/react"
const ProductDigitalSection = () => {
  const [products, setProducts] = useState<productVariant[]>([])
  const { ref, inView } = useInView()
  useEffect(() => {
    getListProductVariantWithSellers().then((data) => {
      setProducts(data)
    })
  }, [])
  return (
    <div className="block ">
      <div className="bg-[#3F1C7A] py-4 flex justify-center items-center gap-10">
        <div className="w-7/12 flex justify-end items-center">
          <Image
            src="/home/image_bg_section/pdigitales.png"
            alt="Gift Cards Products"
            width={600}
          />
        </div>
        <div className="w-5/12 flex justify-start items-center">
          <h2 className="mb-12 text-6xl text-white font-bold flex items-center justify-center">
            Productos digitales
          </h2>
        </div>
      </div>
      <div className="flex-1 content-container p-20">
        <ul className="grid grid-cols-2 small:grid-cols-6 medium:grid-cols-6 gap-x-4 gap-y-8 flex-1">
          {products.length
            ? products.map((product) => (
                <li key={product.id}>
                  <ProductVariantPreview {...product} />
                </li>
              ))
            : Array.from(Array(5).keys()).map((i) => (
                <li key={i}>
                  <SkeletonProductStore />
                </li>
              ))}
        </ul>
        <div
          className="py-16 flex justify-center items-center text-small-regular text-gray-700"
          ref={ref}
        ></div>
      </div>
    </div>
  )
}

export default ProductDigitalSection
