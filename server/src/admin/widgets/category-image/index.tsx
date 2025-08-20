import React, { useEffect, useState, useRef } from "react"
import { getListProductCategory } from "../../actions/product-category/get-list-product-catgegory"
import { addImageToCategory } from "../../actions/product-category/add-product-category"
import { WidgetConfig } from "@medusajs/admin"
import {
  Table,
  Button,
  Text,
  Tooltip,
  IconButton,
  Badge,
  Heading,
  Input,
  Label,
  Container
} from "@medusajs/ui"
import { 
  Photo, 
  Folder, 
  FolderOpen, 
  Plus, 
  Check, 
  XMark,
  ExclamationCircle,
  ArrowUpTray
} from "@medusajs/icons"
import Spinner from "../../components/shared/spinner"
import clsx from "clsx"

type CategoryType = {
  id: string
  handle: string
  is_active: boolean
  is_internal: boolean
  metadata: any | null
  mpath: string
  name: string
  parent_category_id: string | null
  updated_at: string
  image_url: string | null
}

const CategoryImage = () => {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [uploadingCategoryId, setUploadingCategoryId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const data = await getListProductCategory()
      setCategories(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingCategoryId(categoryId)
    setUploadProgress(prev => ({ ...prev, [categoryId]: true }))
    
    try {
      const result = await addImageToCategory(categoryId, file)
      
      // Update the category with the new image URL
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === categoryId 
            ? { ...category, image_url: result.image_url || URL.createObjectURL(file) }
            : category
        )
      )
      
      // Clear the file input
      if (fileInputRefs.current[categoryId]) {
        fileInputRefs.current[categoryId]!.value = ''
      }
      
    } catch (error) {
      console.error("Error al subir imagen:", error)
    } finally {
      setUploadingCategoryId(null)
      setUploadProgress(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  const handleFileChange = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.')
        return
      }
      
      handleImageUpload(categoryId, file)
    }
  }

  const triggerFileInput = (categoryId: string) => {
    fileInputRefs.current[categoryId]?.click()
  }

  const getStatusBadge = (isActive: boolean, isInternal: boolean) => {
    if (isInternal) {
      return <Badge color="orange" size="small">Interno</Badge>
    }
    return isActive 
      ? <Badge color="green" size="small">Activo</Badge>
      : <Badge color="red" size="small">Inactivo</Badge>
  }

  const getCategoryIcon = (category: CategoryType) => {
    if (category.parent_category_id) {
      return <Folder className="text-ui-fg-subtle" />
    }
    return <FolderOpen className="text-ui-fg-base" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Container className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="large" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="p-6">
      <div className="mb-6">
        <Heading level="h2" className="mb-2">
          Gestión de Categorías
        </Heading>
        
      </div>

      {categories.length > 0 ? (
        <div className="min-h-[400px]">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Categoría</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Imagen</Table.HeaderCell>
                <Table.HeaderCell>Handle</Table.HeaderCell>
                <Table.HeaderCell>Actualizado</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => (
                <Table.Row key={category.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category)}
                      <div>
                        <Text weight="plus" size="small">
                          {category.name}
                        </Text>
                        {category.parent_category_id && (
                          <Text size="xsmall" className="text-ui-fg-subtle">
                            Subcategoría
                          </Text>
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell>
                    {getStatusBadge(category.is_active, category.is_internal)}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {category.image_url ? (
                        <Tooltip content={
                          <div className="p-2">
                            <img 
                              src={category.image_url} 
                              alt={category.name}
                              className="max-w-[200px] max-h-[200px] object-cover rounded"
                            />
                          </div>
                        }>
                          <div className="w-10 h-10 rounded border border-ui-border-base overflow-hidden">
                            <img 
                              src={category.image_url} 
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="w-10 h-10 rounded border border-dashed border-ui-border-base flex items-center justify-center">
                          <Photo className="text-ui-fg-subtle" />
                        </div>
                      )}
                      
                      {uploadProgress[category.id] ? (
                        <Badge color="blue" size="small">
                          <Spinner />
                          Subiendo...
                        </Badge>
                      ) : category.image_url ? (
                        <Badge color="green" size="small">
                          <Check />
                          Imagen
                        </Badge>
                      ) : (
                        <Badge color="grey" size="small">
                          <ExclamationCircle />
                          Sin imagen
                        </Badge>
                      )}
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text size="small" className="font-mono text-ui-fg-subtle">
                      {category.handle}
                    </Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text size="small" className="text-ui-fg-subtle">
                      {formatDate(category.updated_at)}
                    </Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={(el) => fileInputRefs.current[category.id] = el}
                        onChange={(e) => handleFileChange(category.id, e)}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <Tooltip content="Subir imagen">
                        <IconButton
                          onClick={() => triggerFileInput(category.id)}
                          disabled={uploadingCategoryId === category.id}
                          variant="transparent"
                          size="small"
                        >
                          {uploadingCategoryId === category.id ? (
                            <Spinner size="small" />
                          ) : (
                            <ArrowUpTray />
                          )}
                        </IconButton>
                      </Tooltip>
                      
                      {category.image_url && (
                        <Tooltip content="Ver imagen">
                          <IconButton
                            onClick={() => window.open(category.image_url!, '_blank')}
                            variant="transparent"
                            size="small"
                          >
                            <Photo />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <FolderOpen className="text-ui-fg-subtle mb-4" />
          <Heading level="h3" className="mb-2">
            No hay categorías disponibles
          </Heading>
          <Text className="text-ui-fg-subtle">
            Las categorías aparecerán aquí una vez que sean creadas
          </Text>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 mt-6 border-t border-ui-border-base">
        <Text size="small" className="text-ui-fg-subtle">
          {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'} en total
        </Text>
      </div>
    </Container>
  )
}

export const config: WidgetConfig = {
  zone: "product.list.before",
}

export default CategoryImage