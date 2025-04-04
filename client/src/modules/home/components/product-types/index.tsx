"use client"

import React, { useState, useEffect } from "react"
import ButtonLigth from "@modules/common/components/button_light"
import { Image } from "@heroui/react"
import Link from "next/dist/client/link"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalProps,
} from "@heroui/react"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import { productVariant } from "types/global"

const FeaturedProductsTest = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [products, setProducts] = useState<productVariant[]>([])

  useEffect(() => {
    getListProductVariantWithSellers().then((data) => {
      setProducts(data)
    })
  }, [])

  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside")

  return (
    <div className="bg-[#EEE] block mx-auto  sm:flex ">
      <div className="block mx-auto py-12">
        <div className="flex justify-center items-center">
          <Image
            src="/home/image_gift_cards.webp"
            alt="Gift Cards Products"
            width={317}
            height={317}
            className="block mx-auto"
          />
        </div>
        <Link href={"/products/gifcardsection"}>
          <ButtonLigth className="block mx-auto mt-6 ">
            Ver gift cards
          </ButtonLigth>
        </Link>
      </div>

      <div className="block mx-auto py-12 ">
        <div className="flex justify-center items-center">
          <Image
            src="/home/image_juegos.webp"
            alt="Games Products"
            width={317}
            height={317}
          />
        </div>
        <Link href={"/products/juegos"}>
          <ButtonLigth className="block ml-auto mr-auto mt-6 " onClick={onOpen}>
            Ver juegos
          </ButtonLigth>
        </Link>
      </div>
      <div className="block mx-auto py-12 ">
        <div className="flex justify-center items-center">
          <Image
            src="/home/image_productos_digitales.webp"
            alt="Digital Products"
            width={317}
            height={317}
          />
        </div>
        <Link href={"/products/productos_digitales"}>
          <ButtonLigth className="block ml-auto mr-auto mt-6 " onClick={onOpen}>
            Ver productos digitales
          </ButtonLigth>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedProductsTest
