"use client"

import ButtonLigth from "@modules/common/components/button_light"
import { Image } from "@nextui-org/react"
import Link from "next/dist/client/link"

const FeaturedProductsTest = () => {
  return (
    <div className="bg-[#EEE] flex ">
      <div className="block ml-auto mr-auto py-12">
        <Image
          src="/home/image_gift_cards.webp"
          alt="Gift Cards Products"
          width={317}
          height={317}
        />
        <Link href="/">
          <ButtonLigth className="block ml-auto mr-auto mt-6 ">
            Ver más
          </ButtonLigth>
        </Link>
      </div>

      <div className="block ml-auto mr-auto py-12 ">
        <Image
          src="/home/image_juegos.webp"
          alt="Games Products"
          width={317}
          height={317}
        />
        <Link href="/">
          <ButtonLigth className="block ml-auto mr-auto mt-6 ">
            Ver más
          </ButtonLigth>
        </Link>
      </div>
      <div className="block ml-auto mr-auto py-12 ">
        <Image
          src="/home/image_productos_digitales.webp"
          alt="Digital Products"
          width={317}
          height={317}
        />
        <Link href="/">
          <ButtonLigth className="block ml-auto mr-auto mt-6 ">
            Ver más
          </ButtonLigth>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedProductsTest
