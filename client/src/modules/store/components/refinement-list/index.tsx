import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCollections } from "medusa-react"
import { ChangeEvent, useState, useContext } from "react"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import { categoryContext, CategoryNode } from "@lib/context/category-context"
import SelectedProducts from "@modules/home/components/slector-products"
import Loader from "@lib/loader"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const RefinementList = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const { collections, isLoading } = useCollections()

  // const [price, setPrice] = useState<number>(refinementList.price || 0)

  const handleCollectionChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = e.target

    const collectionIds = refinementList.collection_id || []

    const exists = collectionIds.includes(id)

    if (checked && !exists) {
      setRefinementList({
        ...refinementList,
        collection_id: [...collectionIds, id],
      })

      return
    }

    if (!checked && exists) {
      setRefinementList({
        ...refinementList,
        collection_id: collectionIds.filter((c) => c !== id),
      })

      return
    }

    return
  }
  const categories = useContext(categoryContext)

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(event.target.value)
    // setPrice(newPrice)
    setRefinementList({
      ...refinementList,
      // price: newPrice,
    })
  }
  return (
    <div className="p-4">
      <div className="content-filter border border-solid border-gray-200 p-5 rounded-[5px] shadow-lg  small:pr-0  small:min-w-[250px]">
        <div className="flex gap-x-3 small:flex-col small:gap-y-3">
          <span className="text-2xl font-bold">Tienda</span>
          <ul className="text-base-regular flex items-center gap-x-4 small:grid small:grid-cols-1 small:gap-y-2">
            {collections?.map((c) => (
              <li key={c.id}>
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={refinementList.collection_id?.includes(
                      c.id
                    )}
                    onChange={(e) => handleCollectionChange(e, c.id)}
                    className="accent-amber-200"
                  />
                  {c.title}
                </label>
              </li>
            ))}
          </ul>

          {/* Filtro de Precio  no*/}
          <div className="border border-solid border-gray-200 p-5 rounded-[5px] shadow-lg mt-4 mr-4">
            {/* <label htmlFor="price-slider" className="">
              Filtrar por precio: <span className="font-bold">${price}</span>
            </label> */}

            <input
              id="price-slider"
              type="range"
              min="0"
              max="1000"
              // value={price}
              onChange={handlePriceChange}
              className="w-full accent-[#1F0046] cursor-pointer mt-2"
            />

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">$0</span>
              <span className="text-sm text-gray-600">$1000</span>
            </div>
          </div>
          <div className="border border-solid border-gray-200 p-5 rounded-[5px] shadow-lg mt-4 mr-4">
            <label htmlFor="price-slider" className="">
              Filtrar por categoría:
            </label>
            {categories ? (
              <div className="mt-2">
                {categories.product_categories &&
                categories.product_categories.length > 0
                  ? categories.product_categories.map(
                      (category: CategoryNode) =>
                        !category.parent_category_id && (
                          <li
                            key={category.id}
                            onClick={() =>
                              categories.setSelectedCategory(category.id)
                            }
                            className="font-bold cursor-pointer"
                          >
                            {category.name}
                          </li>
                        )
                    )
                  : "loading.."}
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefinementList
