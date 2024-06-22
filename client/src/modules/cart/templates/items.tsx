import { LineItem, Region } from "@medusajs/medusa"
import Item from "@modules/cart/components/item"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import Trash from "@modules/common/icons/trash"
import Button from "@modules/common/components/button"
import { useStore } from "@lib/context/store-context"
import Link from "next/link"

interface lineItem extends LineItem {
  store_variant_id: string
  store: { store_name: string; customer_email: string }
}
type ItemsTemplateProps = {
  items?: lineItem[]
  region?: Region
}

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {
  const { deleteItem } = useStore()
  return (
    <div>
      <div className="border-b border-gray-200 pb-3 flex items-center">
        <h1 className="text-xl-semi">Tu carrito</h1>
      </div>
      <div className="grid grid-cols-1 gap-y-8 py-8">
        {items?.length ? (
          <>
            <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar">
              {items
                .sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1
                })
                .map((item) => (
                  <div
                    className="grid grid-cols-[122px_1fr] gap-x-4"
                    key={item.id}
                  >
                    <div className="w-[122px]">
                      <Thumbnail thumbnail={item.thumbnail} size="full" />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg  whitespace-nowrap mr-4 ">
                              {/* <Link
                                    href={`/products/${item.variant.product.handle}`}
                                    legacyBehavior
                                  >
                                    {item.title}
                                  </Link> */}
                              {item.title}
                            </h3>
                            <h4 className="text-xs text-slate-400">
                              Por: {item.store?.store_name}
                            </h4>
                            {/* <LineItemOptions variant={item.variant} /> */}
                            <div className="text-xs text-slate-400">
                              <p> Cantidad: {item.quantity}</p>
                              <p> Precio: {item.unit_price} </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            {/* <LineItemPrice
                                  region={cart.region}
                                  item={item}
                                  style="tight"
                                /> */}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between text-small-regular flex-1">
                        <div>
                          <h4 className="text-sm">
                            Total: ${item.unit_price * item.quantity}
                          </h4>

                          <button
                            className="flex items-center gap-x-1 text-gray-500"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash size={14} className="text-red-600" />
                            <span>Remover</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="p-4 flex flex-col gap-y-4 text-small-regular">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">
                  Subtotal{" "}
                  <span className="font-normal">(Impuestos incluidos)</span>
                </span>
                <span className="text-large-semi">
                  {/* {formatAmount({
                        amount: cart.subtotal || 0,
                        region: cart.region,
                        includeTaxes: false,
                      })} */}
                </span>
              </div>
              <Link href="/cart" passHref>
                <Button className="rounded-30">Ir a pagar</Button>
              </Link>
            </div>
          </>
        ) : (
          <div>
            <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
              <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                <span>0</span>
              </div>
              <span>Tu carrito está vacio.</span>
              <div>
                <Link href="/store">
                  <span className="sr-only">Ir a la tienda</span>
                  <Button className="rounded-30" onClick={close}>
                    Explorar productos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemsTemplate
