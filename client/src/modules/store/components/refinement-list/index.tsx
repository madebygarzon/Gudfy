import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCollections } from "medusa-react"
import { ChangeEvent, useState, useContext, useEffect } from "react"
import { categoryContext, CategoryNode } from "@lib/context/category-context"

type RefinementListProps = {
  refinementList: StoreGetProductsParams & {
    search?: string;
    min_price?: number;
    max_price?: number;
    category_id?: string[];
  }
  setRefinementList: (refinementList: any) => void
}

const RefinementList = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const { collections, isLoading } = useCollections()
  const categories = useContext(categoryContext)
  console.log("categories", categories);
  
  const [minPriceRange, setMinPriceRange] = useState<number>(0)
  const [maxPriceRange, setMaxPriceRange] = useState<number>(1000)
  const [localPrice, setLocalPrice] = useState<number>(1000)
  const [searchTerm, setSearchTerm] = useState<string>(refinementList.search || '')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    refinementList.category_id && refinementList.category_id.length > 0 ? 
    refinementList.category_id[0] : undefined
  )
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const [localCollections, setLocalCollections] = useState<string[]>(
    refinementList.collection_id as string[] || []
  )

  const handleCollectionChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const { checked } = e.target
    let newCollections = [...localCollections]
    
    if (checked && !newCollections.includes(id)) {
      newCollections.push(id)
    } else if (!checked) {
      newCollections = newCollections.filter(c => c !== id)
    }
    
    setLocalCollections(newCollections)
    
    document.dispatchEvent(new CustomEvent('local-collection-filter', { 
      detail: { collections: newCollections } 
    }))
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(event.target.value)
    setLocalPrice(newPrice)
  }

  useEffect(() => {
    const handlePriceRangeUpdate = (event: CustomEvent) => {
      const { minPrice, maxPrice } = event.detail;
      setMinPriceRange(minPrice);
      setMaxPriceRange(maxPrice);
      
      if (localPrice > maxPrice) {
        setLocalPrice(maxPrice);
      }
    };
    
    document.addEventListener('price-range-update', handlePriceRangeUpdate as EventListener);
    
    return () => {
      document.removeEventListener('price-range-update', handlePriceRangeUpdate as EventListener);
    };
  }, [localPrice]);
  
  useEffect(() => {
    const event = new CustomEvent('local-price-filter', { 
      detail: { maxPrice: localPrice } 
    })
    document.dispatchEvent(event)
  }, [localPrice])

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    const newCategoryId = selectedCategory === categoryId ? undefined : categoryId
    const newCategoryName = selectedCategory === categoryId ? '' : categoryName
    setSelectedCategory(newCategoryId)
    
    document.dispatchEvent(new CustomEvent('local-category-filter', { 
      detail: { 
        categoryId: newCategoryId,
        categoryName: newCategoryName
      }   
    }))
  }
  
  const toggleCategoryExpansion = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleSearch = () => {
    document.dispatchEvent(new CustomEvent('local-search-filter', { 
      detail: { searchTerm } 
    }))
  }

  const handleClearFilters = () => {
    setLocalPrice(maxPriceRange)
    setSearchTerm('')
    setSelectedCategory(undefined)
    setLocalCollections([])
    
    document.dispatchEvent(new CustomEvent('local-price-filter', { 
      detail: { maxPrice: maxPriceRange } 
    }))
    
    document.dispatchEvent(new CustomEvent('local-collection-filter', { 
      detail: { collections: [] } 
    }))
    
    document.dispatchEvent(new CustomEvent('local-category-filter', { 
      detail: { categoryId: undefined, categoryName: '' } 
    }))
    
    document.dispatchEvent(new CustomEvent('local-search-filter', { 
      detail: { searchTerm: '' } 
    }))
    
    setRefinementList({
      collection_id: [],
    })
  }

  return (
    <div className="p-3 w-full">
      <div className="content-filter border border-solid border-gray-200 p-4 rounded-md shadow-md">
        <div className="flex flex-col gap-y-3">
          {/* Buscador */}
          <div>
            <h3 className="text-base font-bold mb-1">Buscar</h3>
            <div className="flex gap-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="p-1.5 text-sm border border-gray-300 rounded flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="bg-lila-gf text-white px-3 py-1.5 rounded text-sm hover:bg-lila-gf/80"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Filtro de Precio (Local) */}
          <div>
            <h3 className="text-base font-bold mb-1">Precio máximo: <span className="text-lila-gf">${localPrice}</span></h3>
            <input
              id="price-slider"
              type="range"
              min={minPriceRange}
              max={maxPriceRange}
              step={Math.max(1, Math.floor((maxPriceRange - minPriceRange) / 20))}
              value={localPrice}
              onChange={handlePriceChange}
              className="w-full accent-lila-gf cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>${minPriceRange}</span>
              <span>${maxPriceRange}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-1">Colecciones</h3>
            {isLoading ? (
              <div className="flex justify-center py-2">
                <div className="w-5 h-5 border-2 border-lila-gf border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-y-1 text-sm">
                {collections?.map((c) => (
                  <li key={c.id}>
                    <label className="flex items-center gap-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={refinementList.collection_id?.includes(c.id) || false}
                        onChange={(e) => handleCollectionChange(e, c.id)}
                        className="accent-lila-gf w-3.5 h-3.5"
                      />
                      <span>{c.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold mb-1">Categorías</h3>
            {categories?.product_categories ? (
              <div className="space-y-1">
                {categories.rootCategories.map((category: CategoryNode) => (
                  <div key={category.id} className="category-item border-b border-gray-100 last:border-b-0 py-1">
                    <div className="flex items-center gap-1">
                      {category.children && category.children.length > 0 && (
                        <button 
                          onClick={(e) => toggleCategoryExpansion(category.id, e)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
                        >
                          {expandedCategories.includes(category.id) ? (
                            <span className="text-xs">▼</span>
                          ) : (
                            <span className="text-xs">▶</span>
                          )}
                        </button>
                      )}
                      
                      <div 
                        onClick={() => handleCategoryChange(category.id, category.name)}
                        className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition-colors flex-grow ${selectedCategory === category.id ? 'bg-lila-gf/20 font-bold' : 'hover:bg-gray-100'}`}
                      >
                        {category.image_url ? (
                          <div className="w-6 h-6 overflow-hidden flex-shrink-0 border border-gray-200">
                            <img 
                              src={category.image_url} 
                              alt={category.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-200">
                            <span className="text-xs text-gray-500">{category.name.substring(0, 2)}</span>
                          </div>
                        )}
                        <span className="text-sm">{category.name}</span>
                      </div>
                    </div>
                    
                    {category.children && category.children.length > 0 && expandedCategories.includes(category.id) && (
                      <ul className="ml-6 mt-0.5 space-y-0.5 text-xs">
                        {category.children.map((childCategory) => (
                          <li 
                            key={childCategory.id}
                            onClick={() => handleCategoryChange(childCategory.id, childCategory.name)}
                            className={`flex items-center gap-1.5 cursor-pointer py-0.5 px-1.5 rounded transition-colors ${selectedCategory === childCategory.id ? 'bg-lila-gf/20 font-bold' : 'hover:bg-gray-100'}`}
                          >
                            {childCategory.image_url ? (
                              <div className="w-4 h-4 overflow-hidden flex-shrink-0 border border-gray-100">
                                <img 
                                  src={childCategory.image_url} 
                                  alt={childCategory.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-100">
                                <span className="text-xs text-gray-400">{childCategory.name.substring(0, 1)}</span>
                              </div>
                            )}
                            <span>{childCategory.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-2">
                <div className="w-5 h-5 border-2 border-lila-gf border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <button
            onClick={handleClearFilters}
            className="mt-2 w-full py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default RefinementList
