import React, { useEffect, useState } from "react"
import { getProductsWithCommission } from "../../actions/products/get-products-with-commission"
import { updateProductCommission } from "../../actions/products/update-product-commission"
import {
  getCommission,
  postCommission,
  putCommission,
  deleteCommission,
} from "../../actions/commission"
import { WidgetConfig } from "@medusajs/admin"
import {
  Table,
  Select,
  Text,
  Tooltip,
  IconButton,
  Button,
  FocusModal,
  Input,
  Heading,
  Label,
  Badge
} from "@medusajs/ui"
import { Thumbnail } from "../../components/thumbnail"
import clsx from "clsx"
import { XMark, ChevronDown, Plus, PencilSquare } from "@medusajs/icons"
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
    const [showCommissionForm, setShowCommissionForm] = useState<boolean>(false)
    const [newCommission, setNewCommission] = useState({ name: "", percentage: "" })
    const [isCommissionLoading, setIsCommissionLoading] = useState<boolean>(false)
    const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null)

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
            await updateProductCommission(productId, commissionId)
            
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

    const handleAddCommission = async () => {
        if (!newCommission.name || !newCommission.percentage) return
        
        setIsCommissionLoading(true)
        try {
            const decimalValue = Number(newCommission.percentage) / 100
            await postCommission(newCommission.name, decimalValue)
            setNewCommission({ name: "", percentage: "" })
            await load()
        } catch (err) {
            console.error("Failed to add commission", err)
        } finally {
            setIsCommissionLoading(false)
        }
    }

    const handleUpdateCommission = async (id: string, name: string, percentage: string) => {
        setIsCommissionLoading(true)
        try {
            await putCommission(id, name, Number(percentage))
            await load()
        } catch (err) {
            console.error("Failed to update commission", err)
        } finally {
            setIsCommissionLoading(false)
        }
    }

    const handleDeleteCommission = async (id: string) => {
        setIsCommissionLoading(true)
        try {
            await deleteCommission(id)
            await load()
        } catch (err) {
            console.error("Failed to delete commission", err)
        } finally {
            setIsCommissionLoading(false)
        }
    }

    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg mb-10">
             <div className="mt-2 mb-6">
                <h1 className="text-xl font-bold">Productos y Comisiones</h1>
                <Text className="text-ui-fg-subtle">Asigna comisiones a los productos</Text>
            </div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-ui-border-base">
          <button
            onClick={() => setShowCommissionForm(!showCommissionForm)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-ui-bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <Heading level="h2">Gestión de Comisiones</Heading>
              <Badge>{commissions.length}</Badge>
            </div>
            {showCommissionForm ? <ChevronDown className="rotate-180" /> : <ChevronDown />}
          </button>
          
          {showCommissionForm && (
            <div className="p-6 border-t border-ui-border-base space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Nombre de la comisión"
                    value={newCommission.name}
                    onChange={(e) => setNewCommission(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="w-32">
                  <Label>Porcentaje</Label>
                  <Input
                    type="number"
                    placeholder="%"
                    min="0"
                    max="100"
                    value={newCommission.percentage}
                    onChange={(e) => setNewCommission(prev => ({ ...prev, percentage: e.target.value }))}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleAddCommission}
                  disabled={isCommissionLoading}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir
                </Button>
              </div>

              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Porcentaje</Table.HeaderCell>
                    <Table.HeaderCell>Acciones</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {commissions.map((commission) => (
                    <Table.Row key={commission.id}>
                      <Table.Cell>
                        {editingCommissionId === commission.id ? (
                          <Input
                            value={commission.name}
                            onChange={(e) => {
                              setCommissions(prev =>
                                prev.map(c =>
                                  c.id === commission.id
                                    ? { ...c, name: e.target.value }
                                    : c
                                )
                              )
                            }}
                          />
                        ) : (
                          <span>{commission.name}</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {editingCommissionId === commission.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={(Number(commission.percentage) * 100).toFixed(0)}
                            onChange={(e) => {
                              setCommissions(prev =>
                                prev.map(c =>
                                  c.id === commission.id
                                    ? { ...c, percentage: (Number(e.target.value) / 100).toString() }
                                    : c
                                )
                              )
                            }}
                          />
                        ) : (
                          <span>{(Number(commission.percentage) * 100).toFixed(0)}%</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          {editingCommissionId === commission.id ? (
                            <>
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                  handleUpdateCommission(commission.id, commission.name, commission.percentage)
                                  setEditingCommissionId(null)
                                }}
                                disabled={isCommissionLoading}
                              >
                                Guardar
                              </Button>
                              
                              <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleDeleteCommission(commission.id)}
                                disabled={isCommissionLoading}
                              >
                                Eliminar
                              </Button>
                              <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setEditingCommissionId(null)}
                                disabled={isCommissionLoading}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <Button
                            
                              variant="primary"
                              size="small"
                              onClick={() => setEditingCommissionId(commission.id)}
                            >
                              <PencilSquare  />
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[293px]">
            <Spinner />
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
                            alt={product.title}
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
                                  ? `${product.product_comission.name} (${(Number(product.product_comission.percentage) * 100).toFixed(0)}%)` 
                                  : "Sin seleccionar"
                              )}
                            </Select.Value>
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="null">Sin seleccionar</Select.Item>
                            {commissions.map((commission) => (
                              <Select.Item key={commission.id} value={commission.id}>
                                {commission.name} ({(Number(commission.percentage) * 100).toFixed(0)}%)
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
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.list.before",
};

export default Products;
