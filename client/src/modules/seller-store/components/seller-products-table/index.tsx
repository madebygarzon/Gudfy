import { StoreVariant, StoreData } from "@modules/seller-store/templates"
import { Input } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"

const SellerProductTable: React.FC<{ store: StoreData }> = ({ store }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Productos del vendedor ({store.variants?.length} productos total)
      </h3>
      <div className="bg-white p-4 rounded-lg shadow-lg border pb-4">
        <Input
          className="flex items-center justify-center bg-white h-[38px] w-[20%] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300 my-4 "
          placeholder="Buscar"
          id="search-input"
          type="search"
          onChange={(e) => {}}
        />

        <table className="w-full table-auto border-collapse ">
          <thead className="heade_table rounded text-left border-1 border-gray-200">
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2">Cantidad disponible</th>
              <th className="px-4 py-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            {store.variants?.map((variant) => (
              <tr
                key={variant.store_variant_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2 flex items-center">
                  <Link
                    className=" flex"
                    href={`/products/${variant.parent_title}/${variant.titleVariant}?id=${store.store_id}`}
                  >
                    <Image
                      src={variant.thumbnail}
                      alt={variant.titleVariant}
                      width={48}
                      height={48}
                      className="mr-4 rounded"
                      objectFit="cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {variant.parent_title}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {variant.titleVariant}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-2 text-start text-gray-600">
                  {variant.quantity}
                </td>
                <td className="px-4 py-2 text-start font-bold text-lila-gf">
                  ${variant.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerProductTable
