import { fetchProductsList } from "@lib/data"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCart } from "medusa-react"
import React, { useState, useMemo, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { productVariant } from "types/global"
import ProductVariantPreview from "@modules/product-variant/components/product-variant-preview"
import { getListProductVariantWithSellers } from "@modules/home/actions/get-list-product-variant-with-sellers"
import SkeletonProductStore from "@modules/skeletons/components/skeleton-store"

type InfiniteProductsType = {
  params: StoreGetProductsParams & {
    search?: string;
    min_price?: number;
    max_price?: number;
    category_id?: string[];
  }
}

const InfiniteProducts = ({ params }: InfiniteProductsType) => {
  const [products, setProducts] = useState<productVariant[]>([])
  const [filteredProducts, setFilteredProducts] = useState<productVariant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [minPriceRange, setMinPriceRange] = useState<number>(0)
  const [maxPriceRange, setMaxPriceRange] = useState<number>(1000)
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(1000)
  const [localCollections, setLocalCollections] = useState<string[]>([])
  const [localCategoryId, setLocalCategoryId] = useState<string | undefined>(undefined)
  const [localCategoryName, setLocalCategoryName] = useState<string>('')
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('')
  
  const { cart } = useCart()
  const { ref, inView } = useInView()

  
  const calculatePriceRange = (productList: productVariant[]) => {
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;
    
    productList.forEach(product => {
      if (product.prices && product.prices.length > 1) {
        const minPrice = product.prices[0];
        const maxPrice = product.prices[1];
        
        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
          if (minPrice < min) min = minPrice;
          if (maxPrice > max) max = maxPrice;
        }
      }
    });
    
    if (min === Number.MAX_SAFE_INTEGER) min = 0;
    if (max === 0) max = 1000;
    
    max = Math.ceil(max / 10) * 10;
    min = Math.floor(min / 10) * 10;
    
    return { min, max };
  };
  
  useEffect(() => {
    setIsLoading(true)
    
    const initialFilters = {
      search: params.search,
      min_price: params.min_price,
      max_price: params.max_price,
      category_id: params.category_id && params.category_id.length > 0 ? params.category_id[0] : undefined,
      collection_id: params.collection_id as string[]
    }
    
    getListProductVariantWithSellers(initialFilters)
      .then((data) => {
        setProducts(data)
        setFilteredProducts(data)
        
        const { min, max } = calculatePriceRange(data);
        setMinPriceRange(min);
        setMaxPriceRange(max);
        
        setLocalMaxPrice(max);
        
        document.dispatchEvent(new CustomEvent('price-range-update', { 
          detail: { minPrice: min, maxPrice: max } 
        }));
        
        if (params.search) setLocalSearchTerm(params.search)
        if (params.max_price && params.max_price < max) setLocalMaxPrice(params.max_price)
        if (params.collection_id) setLocalCollections(params.collection_id as string[])
        if (params.category_id && params.category_id.length > 0) setLocalCategoryId(params.category_id[0])
      })
      .catch(error => {
        console.error("Error al cargar productos:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  
  const applyLocalFilters = () => {
    if (products.length === 0) return;
    
    let filtered = [...products];
    
    filtered = filtered.filter(product => {
      if (!product.prices || product.prices.length < 2) return true;
      
      const maxPrice = product.prices[1];
      
      if (typeof maxPrice !== 'number') return true;
      
     
      return maxPrice <= localMaxPrice;
    });
    
  
    
    
    if (localCategoryId) {
      filtered = filtered.filter(product => {
        if (product.categories && Array.isArray(product.categories)) {
          
          return product.categories.some((category: {id: string, name: string}) => category.id === localCategoryId);
        }
        return false;
      });
    }
    
    
    if (localSearchTerm) {
      const searchLower = localSearchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        return (
          product.title.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      });
    }
    
    setFilteredProducts(filtered);
  };

  
  useEffect(() => {
    applyLocalFilters();
  }, [localMaxPrice, localCollections, localCategoryId, localSearchTerm, products]);
  useEffect(() => {
    const handlePriceFilter = (event: CustomEvent) => {
      const { maxPrice } = event.detail;
      if (maxPrice !== undefined) setLocalMaxPrice(maxPrice);
    };

    document.addEventListener('local-price-filter', handlePriceFilter as EventListener);
    
    return () => {
      document.removeEventListener('local-price-filter', handlePriceFilter as EventListener);
    };
  }, []);
  
  
  useEffect(() => {
    const handleCollectionFilter = (event: CustomEvent) => {
      const { collections } = event.detail;
      setLocalCollections(collections);
    };

    document.addEventListener('local-collection-filter', handleCollectionFilter as EventListener);
    
    return () => {
      document.removeEventListener('local-collection-filter', handleCollectionFilter as EventListener);
    };
  }, []);
  
  
  useEffect(() => {
    if (products.length > 0) {
      const { min, max } = calculatePriceRange(products);
      if (max !== maxPriceRange || min !== minPriceRange) {
        setMinPriceRange(min);
        setMaxPriceRange(max);
        
     
        if (localMaxPrice > max) {
          setLocalMaxPrice(max);
        }
        
        document.dispatchEvent(new CustomEvent('price-range-update', { 
          detail: { minPrice: min, maxPrice: max } 
        }));
      }
    }
  }, [products]);
  
  
  useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent) => {
      const { categoryId, categoryName } = event.detail;
      setLocalCategoryId(categoryId);
      setLocalCategoryName(categoryName || '');
      
      if (categoryId && !categoryName && products.length > 0) {
        for (const product of products) {
          if (product.categories) {
            const category = product.categories.find(cat => cat.id === categoryId);
            if (category) {
              setLocalCategoryName(category.name);
              break;
            }
          }
        }
      }
    };

    document.addEventListener('local-category-filter', handleCategoryFilter as EventListener);
    
    return () => {
      document.removeEventListener('local-category-filter', handleCategoryFilter as EventListener);
    };
  }, [products]);
  
  
  useEffect(() => {
    const handleSearchFilter = (event: CustomEvent) => {
      const { searchTerm } = event.detail;
      setLocalSearchTerm(searchTerm);
    };

    document.addEventListener('local-search-filter', handleSearchFilter as EventListener);
    
    return () => {
      document.removeEventListener('local-search-filter', handleSearchFilter as EventListener);
    };
  }, []);

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    p.is_giftcard = false

    return {
      ...p,
      ...params,
    }
  }, [cart?.id, params])

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [`infinite-products-store`, queryParams, cart],
      ({ pageParam }) => fetchProductsList({ pageParam, queryParams }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )
    
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  
  if (!isLoading && filteredProducts.length === 0) {
    return (
      <div className="flex-1 content-container flex items-center justify-center py-12">
        <p className="text-gray-500 text-center">
          No se encontraron productos que coincidan con los criterios de búsqueda.
          <br />
          <button 
            className="mt-4 text-lila-gf underline" 
            onClick={() => window.location.reload()}
          >
            Limpiar filtros
          </button>
        </p>
      </div>
    )
  }
  
  
  const hasActiveFilters = localMaxPrice < 1000 || localSearchTerm || localCategoryId || localCollections.length > 0;
  
  return (
    <div className="flex-1 content-container">
      {isLoading ? (
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-4 gap-y-8 flex-1">
          {Array.from(Array(10).keys()).map((i) => (
            <li key={i}>
              <SkeletonProductStore />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="mb-4 text-sm">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} productos
              </div>
              {hasActiveFilters && (
                <button 
                  onClick={() => window.location.reload()}
                  className="text-lila-gf text-xs underline hover:text-lila-gf/80"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
            
            
            {hasActiveFilters && (
              <div className="mt-2 flex flex-wrap gap-2">
                {localMaxPrice < 1000 && (
                  <span className="bg-lila-gf/10 text-lila-gf px-2 py-1 rounded-full text-xs">
                    Precio máx: ${localMaxPrice}
                  </span>
                )}
                {localSearchTerm && (
                  <span className="bg-lila-gf/10 text-lila-gf px-2 py-1 rounded-full text-xs">
                    Búsqueda: {localSearchTerm}
                  </span>
                )}
                {localCategoryId && (
                  <span className="bg-lila-gf/10 text-lila-gf px-2 py-1 rounded-full text-xs">
                    Categoría: {localCategoryName || 'Seleccionada'}
                  </span>
                )}
                {localCollections.length > 0 && (
                  <span className="bg-lila-gf/10 text-lila-gf px-2 py-1 rounded-full text-xs">
                    Colecciones: {localCollections.length}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-4 gap-y-8 flex-1">
            {filteredProducts.map((product) => (
              <li key={product.id}> 
                <ProductVariantPreview {...product} />
              </li>
            ))}
          </ul>
        </>
      )}
      <div
        className="py-16 flex justify-center items-center text-small-regular text-gray-700"
        ref={ref}
      >
        {isFetchingNextPage && products.length > 0 && (
          <span>Cargando más productos...</span>
        )}
      </div>
    </div>
  )
}

export default InfiniteProducts
