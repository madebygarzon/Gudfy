import { Popover, Transition } from "@headlessui/react"
import { useCartDropdown } from "@lib/context/cart-dropdown-context"
import { useStore } from "@lib/context/store-context"
import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import Button from "@modules/common/components/button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount, useCart } from "medusa-react"
import Link from "next/link"
import Image from "next/image"
import { Fragment, useEffect, useState } from "react"
import { useCartGudfy } from "@lib/context/cart-gudfy"

const CartDropdown = () => {
  //const items = useEnrichedLineItems()
  const { items, listItem, deleteLineItem } = useCartGudfy()

  const { state, open, close } = useCartDropdown()
  const [subTotal, setSubtotal] = useState<number>(0)

  useEffect(() => {
    if (!items?.length) listItem()
    handlerSubTotal()
  }, [items])

  const handlerSubTotal = () => {
    let total = items.length
      ? items.reduce((total: any, i: any) => {
          return total + i.unit_price * i.quantity
        }, 0)
      : 0
    setSubtotal(total)
    console.log("este el el subtotal", total, items)
  }

  return (
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close}>
      <Popover className="relative h-full">
        <Popover.Button className="h-full flex items-center text-[#FFFFFF] font-[500] text-[14px]">
          <div className="flex relative">
            <Link href="/cart" className="">
              <Image
                alt="shop_gudfy"
                src="/header/shop-icon.svg"
                width={32}
                height={32}
              />
            </Link>
            <span className="absolute text-[10px] px-[10px] top-[-20px] right-[-20px] bg-[#3F1C7A] rounded-[50%]">
              {items?.length ? ` ${items.length}` : ""}
            </span>
          </div>
        </Popover.Button>
        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+30px)] right-0 bg-white border-x border-b border-gray-200 w-[382px] text-gray-900"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Carrito de compras</h3>
            </div>
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
                                <h3 className="text-lg overflow-ellipsis overflow-hidden whitespace-nowrap mr-4 w-[130px]">
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
                                onClick={() => deleteLineItem(item.id)}
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
                      Subtotal: {subTotal}
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
                      <>
                        <span className="sr-only">Ir a la tienda</span>
                        <Button className="rounded-30" onClick={close}>
                          Explorar productos
                        </Button>
                      </>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
