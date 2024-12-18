import { getSellerStoreData } from "@modules/home/actions/get-seller-store-data"
import ProductTemplate from "@modules/product-variant/templates"
import SellerStore from "@modules/seller-store/templates"
import { Metadata } from "next"

type Props = {
  params: { sellerstore: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await getSellerStoreData(params.sellerstore)

  return {
    title: `${store.store_name} store`,
    description: `tienda del vendedor`,
    openGraph: {
      title: `${store.store_name} | Gudfy `,
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const store = await getSellerStoreData(params.sellerstore)

  return <SellerStore store={store} />
}
