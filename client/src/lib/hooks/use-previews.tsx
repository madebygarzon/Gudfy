import transformProductPreview from "@lib/util/transform-product-preview"
import { Product, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useMemo } from "react"
import { InfiniteProductPage, ProductPreviewType } from "types/global"

type UsePreviewProps<T> = {
  pages?: Array<PricedProduct>
  region?: Region
}

const usePreviews = <T extends InfiniteProductPage>({
  pages,
  region,
}: UsePreviewProps<T>) => {
  const previews: ProductPreviewType[] = useMemo(() => {
    if (!pages || !region) {
      return []
    }

    const products: PricedProduct[] = pages

    const transformedProducts = products.map((p) =>
      transformProductPreview(p, region)
    )

    return transformedProducts
  }, [pages, region])

  return previews
}

export default usePreviews
