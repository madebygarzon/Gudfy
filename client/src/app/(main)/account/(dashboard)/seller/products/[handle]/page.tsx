import TemplateProduct from "@modules/account/templates/seller-products"
import axios from "axios"
import { waitForDebugger } from "inspector"
import { Metadata } from "next"
import StoreProductsVariant from "@modules/account/components/dashboard-gf/seller-products/store-product-variant"

type Props = {
  params: { handle: string }
}

async function getStoreProductVariant(handle: string) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/seller/store/store-product-variant/`,
    {
      withCredentials: true,
      params: {
        handle,
      },
    }
  )
  if (!res) {
    throw new Error(`Failed to fetch product: ${handle}`)
  }

  return res.data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getStoreProductVariant(params.handle)

  return {
    title: `${product.title} | Gudfy`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Gudfy`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { product } = await getStoreProductVariant(params.handle)

  return <StoreProductsVariant {...product} />
}
