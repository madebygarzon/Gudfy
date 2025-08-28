"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import { useState } from "react"

interface ExtendedStoreParams extends StoreGetProductsParams {
  search?: string;
  min_price?: number;
  max_price?: number;
  category_id?: string[];
}

const StoreTemplate = () => {
  const [params, setParams] = useState<ExtendedStoreParams>({})

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 container mx-auto">
      <div className="small:sticky small:top-20 small:w-1/4 w-full mb-4 small:mb-0">
        <RefinementList refinementList={params} setRefinementList={setParams} />
      </div>
      <div className="flex-1 small:pl-6 small:h-[calc(100vh-120px)] small:overflow-y-auto small:sticky small:top-20">
        <InfiniteProducts params={params} />
      </div>
    </div>
  )
}

export default StoreTemplate
