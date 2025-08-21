import medusaRequest from "@lib/medusa-fetch"
import { getProductVariant } from "@modules/home/actions/get-product-variant"
import ProductTemplate from "@modules/product-variant/templates"
import { Metadata } from "next"

type Props = {
  params: { productvariant: string }
  searchParams: { id?: string }
}

async function getProducts(productvariant: string) {
  const product = await getProductVariant(
    decodeURIComponent(productvariant).replaceAll("-", " ")
  )
  if (!product) {
    throw new Error(`Failed to fetch product: ${productvariant}`)
  }

  return product
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProducts(params.productvariant)

  return {
    title: `${product.title} | Gudfy`,
    description: `${product.description}`,
    openGraph: {
      title: `${product.title} | Gudfy `,
      description: `${product.description}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const product = await getProducts(params.productvariant)

  const id = searchParams.id

  return <ProductTemplate product={product} storeId={id} />
}
