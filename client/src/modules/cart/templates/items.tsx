import { LineItem, Region } from "@medusajs/medusa"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import Trash from "@modules/common/icons/trash"
import Button from "@modules/common/components/button"
import Link from "next/link"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import { useState, useEffect } from "react"
import { getListVariantAndStock } from "../actions/get-listvariandAndStock"
import { Avatar } from "@nextui-org/react"
import { Divider } from "@nextui-org/react"
import InputSelectStock from "../components/input-stock"

import { Alert } from "@medusajs/ui"

interface lineItem
  extends Omit<
    LineItem,
    "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
  > {
  store_variant_id: string

  store: { store_name: string; customer_email: string }
}
type ItemsTemplateProps = {
  items?: lineItem[]
  modifyProduct?: string[]
}
type IdStoreVariantAndStock = {
  store_variant_id: string
  stock: number
}[]

const ItemsTemplate = ({ items, modifyProduct }: ItemsTemplateProps) => {
  const { deleteLineItem, updateLineItem } = useCartGudfy()
  const [selectProducts, setSelectProducts] = useState<IdStoreVariantAndStock>()

  const handlerVariantStock = async () => {
    if (items?.length) {
      const variantStock = await getListVariantAndStock(items)
      setSelectProducts(variantStock.itemsStock)
    }
  }

  const handlerSelectStock = (id: string) => {
    if (selectProducts?.length)
      return selectProducts.find((idSV) => idSV.store_variant_id === id)?.stock
  }

  useEffect(() => {
    handlerVariantStock()
  }, [items, modifyProduct])

  return (
    <div>
      <div className="border-b border-gray-200 pb-3 flex items-center">
        <h1 className="text-xl-semi">Tu carrito</h1>
      </div>
      <div className="grid grid-cols-1 gap-y-8 py-8">
        {items?.length ? (
          <>
            <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-2 no-scrollbar">
              {items
                .sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1
                })
                .map((item) => (
                  <>
                    <div className="flex relative w-full justify-between ">
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4 "
                        key={item.id}
                      >
                        <div className="w-[122px]">
                          <Thumbnail thumbnail={item.thumbnail} size="full" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold  whitespace-nowrap mr-4 ">
                                  {item.title}
                                </h3>
                                <div className=" flex first-line:text-slate-400 gap-2 rounded-[5px]  mt-4">
                                  <Avatar
                                    size="sm"
                                    color="secondary"
                                    className=""
                                    name={item.store.store_name.charAt(0)}
                                  />{" "}
                                  <div>
                                    <p className="text-base font-semibold">
                                      {" "}
                                      {item.store?.store_name}{" "}
                                    </p>
                                    <div className="text-xs">
                                      <p> Precio: {item.unit_price} </p>
                                      <p>
                                        Stock:
                                        {handlerSelectStock(
                                          item.store_variant_id
                                        ) || (
                                          <div className="text-center text-red-600 border border-red-600 rounded-[5px] w-auto py-1 px-2">
                                            {" "}
                                            Sin stock
                                          </div>
                                        )}
                                      </p>
                                    </div>
                                  </div>
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
                        </div>
                      </div>
                      <div className="w-[50%]">
                        <div className="mx-5  h-full flex items-center justify-start text-base ">
                          {handlerSelectStock(item.store_variant_id) ? (
                            <InputSelectStock
                              currentStock={
                                handlerSelectStock(item.store_variant_id) || 0
                              }
                              itemId={item.id}
                              currentQuantity={item.quantity}
                              key={item.id}
                              unitPrice={item.unit_price}
                              updateLineItem={updateLineItem}
                            />
                          ) : (
                            <p className="text-rose-600">
                              No hay cantidad suficiente
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute  top-0 right-0  py-1 px-">
                        {modifyProduct?.length ? (
                          modifyProduct.map((itemId) => {
                            if (itemId === item.store_variant_id)
                              return (
                                <>
                                  <Alert variant="warning">
                                    Cantidad Insuficiente
                                  </Alert>
                                </>
                              )
                          })
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="absolute  bottom-0 right-6 gap-2  py-1 px-">
                        <button
                          className="flex items-center gap-x-1 text-gray-500"
                          onClick={() => deleteLineItem(item.id)}
                        >
                          <Trash size={15} className="text-red-600" />
                          <span className="text-sm">Remover</span>
                        </button>
                      </div>
                    </div>
                    <Divider className="my-4" />
                  </>
                ))}
            </div>
            <div className="p-4 flex flex-col gap-y-4 text-small-regular">
              {/* <Link href="/cart" passHref>
                <Button className="rounded-30">Ir a pagar</Button>
              </Link> */}
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
