import clsx from "clsx"
import Link from "next/link"
import { ProductPreviewType } from "types/global"
import Thumbnail from "../thumbnail"
import Image from "next/image"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"

type preview = {
  handle: string
  thumbnail: string
  variants: PricedVariant[]
}

const ProductPreview = ({ handle, thumbnail, variants }: preview) => {
  return (
    <>
      {variants.length ? (
        variants.map((pv) => (
          <li key={pv.id} className="text-white">
            <Link
              href={`/products/${handle}/${pv.title
                ?.replace(" ", "_")
                .toLowerCase()}`}
            >
              <div>
                <Thumbnail thumbnail={thumbnail} size="full" />
                <div className="flex justify-center">
                  <div className=" text-base-regular text-center mt-2 z-10 w-[90%] ">
                    <span>{pv.title}</span>
                    <div className="flex w-full items-center"></div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <div></div>
      )}
    </>
  )
}

export default ProductPreview
