import clsx from "clsx"
import Link from "next/link"
import { productVariant } from "types/global"
import Thumbnail from "@modules/products/components/thumbnail"
import Image from "next/image"
import { Avatar } from "@nextui-org/react"

const ProductPreview = ({
  title,
  productparent,
  id,
  thumbnail,
  prices,
}: productVariant) => {
  return (
    <Link href={`/products/${productparent}/${title}`}>
      <div>
        <Thumbnail thumbnail={thumbnail} size="full" />
        <div className="flex justify-center">
          <div className=" text-base-regular text-center mt-2 z-10 w-[90%] ">
            <div className="flex justify-center pt-1">
              <Image
                src="product/stars.svg"
                alt="stars_gudfy"
                width={100}
                height={50}
              />
            </div>
            <span className="flex font-semibold w-full text-center text-xs items-center justify-center"></span>
            <span className="font-bold">{title}</span>
            <div className="flex w-full items-center">
              <span className="font-semibold w-full text-center">
                Precio: $
                {prices.length == 1
                  ? `${prices[0]}`
                  : `${prices[0]} - ${prices[prices.length - 1]}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductPreview
