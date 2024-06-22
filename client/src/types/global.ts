import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { NextPage } from "next"
import { AppProps } from "next/app"
import { ReactElement, ReactNode } from "react"

export type CollectionData = {
  id: string
  title: string
}

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type StoreNavData = {
  collections: CollectionData[]
  hasMoreCollections: boolean
  featuredProducts: PricedProduct[]
}

// page props for store pages (products and collection pages)
export type StoreProps<T extends unknown> = {
  page: {
    data: T
  }
}

// page props for non-store pages (home, about, contact, etc)
export type SiteProps = {
  site: {
    navData: StoreNavData
  }
}

export type PrefetchedPageProps = {
  notFound: boolean
}

// For pages with nested layouts
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout<P = {}, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>
}
export type storeProductVariant = {
  id: string
  title: string
  description: string
  thumbnail: string
  productparent: string
  sellers: {
    store_variant_id: string
    store_id: string
    store_name: string
    email: string
    amount: number
    price: number
  }[]
}

export type productVariant = {
  id: string
  title: string
  prices: number[]
  productparent: string
  thumbnail: string
  desciption: string
}

export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
}
export type SellerCredentials = {
  name: string
  last_name: string
  email: string
  phone: string
  contry: string
  city: string
  address: string
  postal_code: string
  supplier_name: string
  supplier_type: string
  company_name: string
  company_country: string
  company_city: string
  company_address: string
  supplier_documents?: string
  quantity_products_sale: string
  example_product: string
  quantity_per_product: string
  current_stock_distribution: string
  front_identity_document?: string
  revers_identity_document?: string
  address_proof?: string
  field_payment_method_1?: string
  field_payment_method_2?: string
}

export type InfiniteProductPage = {
  response: {
    products: PricedProduct[]
    count: number
  }
}
