"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import Recommendedproduct from "@modules/products/components/products-home-gf"
import { useState } from "react"
//import ButonSelector from "./butons_selected"
import Categories from "@modules/home/components/tab-categories"

const SelectedProducts = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  return (
    <div className="py-6 flex flex-col items-center">
      <Categories refinementList={params} setRefinementList={setParams} />
      {/* <ButonSelector refinementList={params} setRefinementList={setParams} /> */}
      <Recommendedproduct params={params} />
    </div>
  )
}

export default SelectedProducts
