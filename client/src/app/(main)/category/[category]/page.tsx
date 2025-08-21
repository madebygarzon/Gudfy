
import CategoryProducts from "@modules/layout/components/category-products/category-page"
import { Metadata } from "next"

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const categoryName = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${categoryName} | Gudfy`,
    description: `Productos de la categoría ${categoryName} en Gudfy`,
    openGraph: {
      title: `${categoryName} | Gudfy`,
      description: `Explora nuestra selección de productos en la categoría ${categoryName}`,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  return <CategoryProducts params={params} />
}
