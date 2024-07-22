"use client"

import React, { useState, useEffect } from "react"
import ButtonLigth from "@modules/common/components/button_light"
import { Image } from "@nextui-org/react"
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
} from "@nextui-org/react"
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
    <div className="bg-[#EEE] flex ">
      <div className="block ml-auto mr-auto py-12">
        <Image
          src="/home/image_gift_cards.webp"
          alt="Gift Cards Products"
          width={317}
          height={317}
        />

        <ButtonLigth className="block ml-auto mr-auto mt-6 " onClick={onOpen}>
          Ver gift cards
        </ButtonLigth>
        <Modal
          size="5xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="w-fullflex flex-col gap-1">
                  <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%] ml-8">
                    Giftcards
                  </p>
                </ModalHeader>
                <ModalBody>
                  <ul className="grid grid-cols-2 small:grid-cols-5 gap-x-6 gap-y-8">
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
                </ModalBody>
                <ModalFooter>
                  <ButtonLigth color="secundary" onClick={onClose}>
                    Cerrar
                  </ButtonLigth>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      <div className="block ml-auto mr-auto py-12 ">
        <Image
          src="/home/image_juegos.webp"
          alt="Games Products"
          width={317}
          height={317}
        />
         <ButtonLigth className="block ml-auto mr-auto mt-6 " onClick={onOpen}>
          Ver juegos
        </ButtonLigth>
        <Modal
          size="5xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="w-fullflex flex-col gap-1">
                  <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%] ml-8">
                    Juegos
                  </p>
                </ModalHeader>
                <ModalBody>
                  <ul className="grid grid-cols-2 small:grid-cols-5 gap-x-6 gap-y-8">
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
                </ModalBody>
                <ModalFooter>
                  <ButtonLigth color="secundary" onClick={onClose}>
                    Cerrar
                  </ButtonLigth>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className="block ml-auto mr-auto py-12 ">
        <Image
          src="/home/image_productos_digitales.webp"
          alt="Digital Products"
          width={317}
          height={317}
        />
         <ButtonLigth className="block ml-auto mr-auto mt-6 " onClick={onOpen}>
          Ver productos digitales
        </ButtonLigth>
        <Modal
          size="5xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="w-fullflex flex-col gap-1">
                  <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%] ml-8">
                    Productos digitales
                  </p>
                </ModalHeader>
                <ModalBody>
                  <ul className="grid grid-cols-2 small:grid-cols-5 gap-x-6 gap-y-8">
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
                </ModalBody>
                <ModalFooter>
                  <ButtonLigth color="secundary" onClick={onClose}>
                    Cerrar
                  </ButtonLigth>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}

export default FeaturedProductsTest
