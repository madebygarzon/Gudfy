import React, { useState, useEffect } from "react"
import { Table, DropdownMenu, IconButton, Input, Select } from "@medusajs/ui"
import {
  PencilSquare,
  XMark,
  Eye,
  Check,
  ArrowLongRight,
  ArrowLongLeft,
} from "@medusajs/icons"
import Spinner from "@modules/common/icons/spinner"
import { getSellerProduct } from "@modules/account/actions/get-seller-product"
import { ProductCategory } from "@medusajs/medusa"
import CreateProduct from "./create-product"
import EditProduct from "./edit-product"
import Image from "next/image"
import { Product, Variant } from "types/medusa"
import ImagePlaceholderIcon from "@modules/common/icons/defaultIcon"
import getAllCategories from "@modules/account/actions/get-data-categories"

import { useDisclosure } from "@nextui-org/react"

type ListDataSellerProduct = {
  dataProduct: Array<Product>
  dataFilter: Array<Product>
  dataPreview: Array<Product>
  count: number
}
const dataSelecterPAge = [3, 6, 10]
const dataSelecFilter = [
  {
    value: "todos",
    label: "Todos",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "published",
    label: "Published",
  },
]
export default function ProductsTable() {
  const [dataProducts, setDataProducts] = useState<ListDataSellerProduct>({
    dataProduct: [],
    dataPreview: [],
    dataFilter: [],
    count: 0,
  })

  //Control de paginacion para los productos
  const [pageTotal, setPagetotal] = useState<number>() // paginas totales
  const [page, setPage] = useState(1)
  const [rowsPerPages, setRowsPerPages] = useState(3) // numero de filas por pagina
  const [reset, setReset] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<ProductCategory[]>()

  const categoriesOrder = () => {
    getAllCategories().then((e) => {
      const newArray: ProductCategory[] = []
      e.product_categories.forEach((cateogry) => {
        if (cateogry.parent_category) return
        newArray.push(cateogry)
        if (cateogry.category_children) {
          cateogry.category_children.forEach((cateChild) => {
            newArray.push(cateChild)
          })
        }
      })
      setCategories(newArray)
    })
  }
  //------------------------------------------
  const handlerGetListProduct = async () => {
    const dataProduct = await getSellerProduct()
    setPagetotal(Math.ceil(dataProduct[1] / rowsPerPages))
    setDataProducts({
      dataProduct: dataProduct[0],
      dataFilter: dataProduct[0],
      dataPreview: handlerPreviewProducts(dataProduct[0], 1),
      count: dataProduct[1],
    })
    setLoading(false)
  }

  const handlerNextPage = (action: any) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataProducts.dataFilter!) {
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataFilter,
              page + 1
            ),
          })
          return old + 1
        } else
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataProduct,
              page + 1
            ),
          })

        return old + 1
      })

    if (action == "PREV")
      setPage((old) => {
        if (dataProducts.dataFilter!) {
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataFilter,
              page - 1
            ),
          })
          return old - 1
        } else
          setDataProducts({
            ...dataProducts,
            dataPreview: handlerPreviewProducts(
              dataProducts.dataProduct,
              page - 1
            ),
          })

        return old - 1
      })
  }

  const handlerPreviewProducts = (queryParams: any, page: any, rows?: any) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const dataRowPage = rows || rowsPerPages
    const start = (page - 1) * dataRowPage
    const end = page * dataRowPage
    const newArray = queryParams.slice(start, end)
    setPagetotal(Math.ceil(queryParams.length / dataRowPage))
    return newArray
  }

  useEffect(() => {
    setLoading(true)
    handlerGetListProduct()
    categoriesOrder()
  }, [reset])

  const handlerFilterRows = (value: any) => {
    const valueInt = parseInt(value)
    setRowsPerPages(valueInt)
    setDataProducts({
      ...dataProducts,
      dataPreview: handlerPreviewProducts(
        dataProducts.dataFilter ?? dataProducts.dataProduct,
        1,
        valueInt
      ),
    })
  }
  const handlerFilterStatus = (value: any) => {
    setPage(1)
    let dataFilter
    switch (value) {
      case dataSelecFilter[1].value:
        dataFilter = dataProducts.dataProduct.filter(
          (data) => data.status === "draft"
        )

        break
      case dataSelecFilter[2].value:
        dataFilter = dataProducts.dataProduct.filter(
          (data) => data.status === "published"
        )

        break
      default:
        dataFilter = dataProducts.dataProduct
        break
    }
    setPagetotal(Math.ceil(dataFilter.length / rowsPerPages))
    setDataProducts({
      ...dataProducts,
      dataFilter: dataFilter,
      dataPreview: handlerPreviewProducts(dataFilter, 1),
    })
  }
  const handlerFilterCategories = (value: any) => {
    setPage(1)

    const dataFilter = dataProducts.dataProduct.filter((data) => {
      const category = data.categories.find((ct) => ct.name === value)
      if (category) return true
      return false
    })
    setPagetotal(Math.ceil(dataFilter.length / rowsPerPages))
    setDataProducts({
      ...dataProducts,
      dataFilter: dataFilter,
      dataPreview: handlerPreviewProducts(dataFilter, 1),
    })
  }
  // Controller from Edit Product
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [editProduct, setEditProduct] = useState<Product>()
  const handlerEditProduct = (product: Product) => {
    setEditProduct(product)
    onOpen()
  }
  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataProducts.dataProduct.filter((data) => {
      const nameIncludes = data.title.toLowerCase().includes(e.toLowerCase())

      return nameIncludes
    })
    setDataProducts({
      ...dataProducts,
      dataPreview: handlerPreviewProducts(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    })
  }

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <h1 className=" text-xl font-bold"> Tus Productos</h1>
        <div className="mt-2 flex justify-between">
          <div className="flex gap-5 h-full items-end py-4">
            <div className="w-[170px] ">
              <Select onValueChange={handlerFilterStatus}>
                <Select.Trigger>
                  <Select.Value placeholder="Filtar por Estado " />
                </Select.Trigger>
                <Select.Content>
                  {dataSelecFilter.map((item) => (
                    <Select.Item key={item.value} value={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="w-[170px] ">
              <Select onValueChange={handlerFilterCategories}>
                <Select.Trigger>
                  <Select.Value placeholder="Filtar por categoria: " />
                </Select.Trigger>
                <Select.Content>
                  {categories?.map((item) => (
                    <Select.Item key={item.id} value={item.name}>
                      {item.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="w-[250px]">
              <Input
                placeholder="Search"
                id="search-input"
                type="search"
                onChange={(e) => handlerSearcherbar(e.target.value)}
              />
            </div>
          </div>
          <div className="flex itmes-end py-4">
            <CreateProduct setReset={setReset} />
          </div>
        </div>
        {!isLoading && dataProducts.dataPreview.length ? (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Nombre</Table.HeaderCell>
                  <Table.HeaderCell>Estado</Table.HeaderCell>
                  <Table.HeaderCell>Inventario</Table.HeaderCell>
                  <Table.HeaderCell>Categorias</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dataProducts.dataPreview?.map((data, i) => {
                  return (
                    <Table.Row
                      key={data.id}
                      onClick={() => handlerEditProduct(data)}
                      className="cursor-pointer"
                    >
                      <Table.Cell>
                        <div className="flex gap-3 items-center">
                          {data.thumbnail ? (
                            <Image
                              src={data.thumbnail}
                              width={28}
                              height={38}
                              alt={data.title}
                            />
                          ) : (
                            <ImagePlaceholderIcon />
                          )}
                          {data.title}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{data.status}</Table.Cell>
                      <Table.Cell>
                        {data.variants.length ? (
                          <InventoryVariants variants={data.variants} />
                        ) : (
                          <span>Sin Inventario</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {data.categories.length ? (
                          data.categories.map((c) => (
                            <span className="text-[12px] capitalize">{`${c.name}, `}</span>
                          ))
                        ) : (
                          <p className="text-[12px]">Sin Categoria</p>
                        )}
                      </Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        {/* <IconButton>
                          <Eye />
                        </IconButton>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <IconButton>
                              <PencilSquare className="text-ui-fg-subtle" />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() => {}}
                            >
                              <Check className="text-ui-fg-subtle" />
                              Publico
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() => {}}
                            >
                              <XMark className="text-ui-fg-subtle" />
                              Privado
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu> */}
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </>
        ) : (
          <Spinner size="32" />
        )}
      </div>
      <div className="flex justify-between p-4">
        <div>
          {`${dataProducts.dataFilter.length} Productos`}{" "}
          <Select onValueChange={handlerFilterRows} size="small">
            <Select.Trigger>
              <Select.Value placeholder="3" />
            </Select.Trigger>
            <Select.Content>
              {dataSelecterPAge.map((item) => (
                <Select.Item key={item} value={`${item}`}>
                  {item}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="flex gap-5">
          <>
            {page} of {pageTotal}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == pageTotal ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
      {editProduct && (
        <EditProduct
          key={editProduct.id}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          productData={editProduct}
          setReset={setReset}
        />
      )}
    </div>
  )
}

const InventoryVariants = (v: any) => {
  const numVari = v.variants.length
  const Inventory = v.variants.reduce(
    (acu: any, vari: { inventory_quantity: any }) =>
      acu + vari.inventory_quantity,
    0
  )

  return <span>{`Variantes: ${numVari}, Inventario: ${Inventory}`}</span>
}
