import { StoreVariant, StoreData } from "@modules/seller-store/templates"
import { Input } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import { BlankIcon } from "@lib/util/icons"
import { Avatar } from "@nextui-org/react"

const SellerProductTable: React.FC<{ store: StoreData }> = ({ store }) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredVariants, setFilteredVariants] = useState<StoreVariant[]>(
    store.variants || []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = store.variants?.filter((variant) =>
      `${variant.parent_title} ${variant.titleVariant}`
        .toLowerCase()
        .includes(term)
    )
    setFilteredVariants(filtered || [])
  }

  return (
    <div className="rounded-lg shadow-2xl p-8">
      {/* Fixed Title and Search Bar */}
      <div className="sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Avatar
              size="lg"
              src={store.avatar || " "}
              className=" w-[50px] h-[50px] border-solid border-1 border-[#9B48ED] text-3xl text-lila-gf font-extrabold"
            />

            <div className="block">
              <h3 className=" text-xl font-bold text-gray-700 capitalize">
                {store.store_name}
              </h3>
              <p className="text-xs">
                Productos de la tienda: ({store.variants?.length} productos
                total)
              </p>
            </div>
          </div>

          <div className="w-[170px]">
            <Input
              className="flex items-center justify-center bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300"
              placeholder="Buscar"
              id="search-input"
              type="search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Table with Scroll */}
      <div className="bg-white  min-h-[399px] max-h-[400px] overflow-y-auto  rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky bg-white z-10 h-full top-0 text-left text-gray-700 shadow-sm">
            <tr>
              <th className="px-8 py-2">Productos</th>
              <th className="px-4 py-2">Cantidad disponible</th>
              <th className="px-4 py-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            {filteredVariants.length > 0 ? (
              filteredVariants.map((variant) => (
                <tr
                  key={variant.store_variant_id}
                  className="hover:bg-gray-100"
                >
                  <td className="px-4 py-2 flex items-center">
                    <Link
                      className="flex"
                      href={`/products/${variant.parent_title}/${variant.titleVariant}?id=${store.store_id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-[122px]">
                          <Thumbnail
                            thumbnail={variant.thumbnail}
                            size="bsmall"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-xl font-bold  whitespace-nowrap mr-4 ">
                              {variant.titleVariant}
                            </h3>
                            <BlankIcon width={15} />
                          </div>
                          <p className="font-medium text-gray-800">
                            {variant.parent_title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-start text-gray-600">
                    {variant.quantity}
                  </td>
                  <td className="px-4 py-2 text-start font-bold">
                    ${variant.price.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerProductTable
