"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import Recommendedproduct from "@modules/products/components/products-home-gf"
import { useState } from "react"
//import ButonSelector from "./butons_selected"
import Categories from "@modules/home/components/tab-categories"

const SelectedProducts = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  return (
    <div className="md:py-10 py-1 ">
      {<div className=" ">
        <Categories refinementList={params} setRefinementList={setParams} />
      </div>}
      {/* <ButonSelector refinementList={params} setRefinementList={setParams} /> */}
      <div className="flex items-center w-[100%]">
        <Recommendedproduct params={params} />
      </div>
    </div>
  )
}

export default SelectedProducts
