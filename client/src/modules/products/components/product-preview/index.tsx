import clsx from "clsx"
import Link from "next/link"
import { ProductPreviewType } from "types/global"
import Thumbnail from "../thumbnail"
import Image from "next/image"

const ProductPreview = ({
  title,
  handle,
  thumbnail,
  price,
}: ProductPreviewType) => {
  return (
    <Link href={`/products/${handle}`}>
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
            <span>{title}</span>
            <div className="flex w-full items-center">
              {price ? (
                <>
                  {price.price_type === "sale" && (
                    <span className="line-through text-gray-500 text-center">
                      {price.original_price}
                    </span>
                  )}
                  <span
                    className={clsx("font-semibold w-full text-center ", {
                      "text-rose-500": price.price_type === "sale",
                    })}
                  >
                    {price.calculated_price}
                  </span>
                </>
              ) : (
                <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductPreview
