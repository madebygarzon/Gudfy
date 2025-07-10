import React, { useEffect, useState } from "react"
import { getProductsWithCommission } from "../../actions/products/get-products-with-commission"
import { updateProductCommission } from "../../actions/products/update-product-commission"
import {
    getCommission
  } from "../../actions/commission"
import { WidgetConfig } from "@medusajs/admin"
import {
  Table,
  Select,
  Text,
  Tooltip,
  IconButton,
  Button,
  FocusModal
} from "@medusajs/ui"
import { Thumbnail } from "../../components/thumbnail"
import clsx from "clsx"
import { XMark } from "@medusajs/icons"
import Spinner from "../../components/shared/spinner"

type ProductType = {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  title: string
  subtitle: string | null
  description: string
  handle: string
  is_giftcard: boolean
  status: string
  thumbnail: string
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  hs_code: string | null
  origin_country: string | null
  mid_code: string | null
  material: string | null
  collection_id: string | null
  type_id: string | null
  discountable: boolean
  external_id: string | null
  metadata: any | null
  product_comission_id: string | null
  product_comission?: {
    id: string
    name: string
    percentage: string
  } | null
}

type CommissionType = {
  id: string
  name: string
  percentage: string
}

const Products = () => {
    const [products, setProducts] = useState<ProductType[]>([])
    const [commissions, setCommissions] = useState<CommissionType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [updatingProductId, setUpdatingProductId] = useState<string | null>(null)

    const load = async () => {
        try {
          const data = await getCommission()
          setCommissions(data)
        } catch (err) {
          console.error("Failed to load commission groups", err)
        }
    }

    const getDataProducts = async () => {
        setIsLoading(true)
        try {
            const data = await getProductsWithCommission()
            setProducts(data)
        } catch (err) {
            console.error("Failed to load products", err)
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        load()
        getDataProducts()
    }, [])

    const handleCommissionChange = async (productId: string, commissionId: string | null) => {
        setUpdatingProductId(productId)
        setIsUpdating(true)
        
        try {
            // Llamada a la API para actualizar la comisión del producto
            await updateProductCommission(productId, commissionId)
            
            // Actualizar el estado local
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.id === productId 
                        ? { 
                            ...product, 
                            product_comission_id: commissionId,
                            product_comission: commissionId 
                                ? commissions.find(c => c.id === commissionId) 
                                : null 
                          } 
                        : product
                )
            )
        } catch (error) {
            console.error("Error al actualizar la comisión:", error)
        } finally {
            setIsUpdating(false)
            setUpdatingProductId(null)
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "draft":
                return "Borrador"
            case "published":
                return "Publicado"
            case "rejected":
                return "Rechazado"
            default:
                return status
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "draft":
                return "text-yellow-500"
            case "published":
                return "text-green-600"
            case "rejected":
                return "text-red-600"
            default:
                return ""
        }
    }

    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg mb-10">
            <div className="mt-2 mb-6">
                <h1 className="text-xl font-bold">Productos y Comisiones</h1>
                <Text className="text-ui-fg-subtle">Asigna comisiones a los productos</Text>
            </div>

            {isLoading ? (
                <div className="min-h-[293px] flex items-center justify-center">
                    <Spinner size="large" variant="secondary" />
                </div>
            ) : products.length > 0 ? (
                <div className="min-h-[293px] pb-10">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Producto</Table.HeaderCell>
                                <Table.HeaderCell>Estado</Table.HeaderCell>
                                <Table.HeaderCell>Comisión</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {products.map((product) => (
                                <Table.Row key={product.id}>
                                    <Table.Cell>
                                        <Tooltip content={
                                            <div className="w-auto h-auto flex flex-col items-center">
                                                <h3 className="text-base font-bold text-center">
                                                    {product.title}
                                                </h3>
                                                <img
                                                    src={product.thumbnail}
                                                    className="object-fill object-center max-h-[200px] max-w-[200px] my-3"
                                                />
                                            </div>
                                        }>
                                            <div className="flex gap-2 items-center">
                                                <Thumbnail src={product.thumbnail} />
                                                <span>{product.title}</span>
                                            </div>
                                        </Tooltip>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className={clsx(getStatusColor(product.status))}>
                                            {getStatusLabel(product.status)}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="w-[200px]">
                                            <Select 
                                                onValueChange={(value) => handleCommissionChange(product.id, value === "null" ? null : value)}
                                                value={product.product_comission_id || "null"}
                                                disabled={isUpdating && updatingProductId === product.id}
                                            >
                                                <Select.Trigger>
                                                    <Select.Value>
                                                        {isUpdating && updatingProductId === product.id ? (
                                                            <div className="flex items-center gap-2">
                                                                <Spinner size="small" />
                                                                <span>Actualizando...</span>
                                                            </div>
                                                        ) : (
                                                            product.product_comission 
                                                                ? `${product.product_comission.name} (${product.product_comission.percentage}%)` 
                                                                : "Sin seleccionar"
                                                        )}
                                                    </Select.Value>
                                                </Select.Trigger>
                                                <Select.Content>
                                                    <Select.Item value="null">Sin seleccionar</Select.Item>
                                                    {commissions.map((commission) => (
                                                        <Select.Item key={commission.id} value={commission.id}>
                                                            {commission.name} ({commission.percentage}%)
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[293px]">
                    <XMark className="text-ui-fg-subtle" />
                    <span>No hay productos disponibles</span>
                </div>
            )}

            <div className="flex pt-[10] mt-[10]">
                <div className="w-[35%]">{`${products.length || 0} Productos`}</div>
            </div>
        </div>
    )
}

export const config: WidgetConfig = {
    zone: "product.list.before",
};

export default Products;
