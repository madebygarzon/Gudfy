"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import Recommendedproduct from "@modules/products/components/products-home-gf"
import { useState } from "react"
import ButonSelector from "./butons_selected"

const SelectedProducts = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({
    collection_id: [],
  })
  return (
    <div className="py-6 flex flex-col items-center">
      <ButonSelector refinementList={params} setRefinementList={setParams} />
      <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%]">
        ¡Recomendadas para ti!
      </p>
      <Recommendedproduct params={params} />
    </div>
  )
}

export default SelectedProducts
