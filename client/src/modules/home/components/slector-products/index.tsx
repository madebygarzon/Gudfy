"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import { useState } from "react"
import ButonSelector from "./butons_selected"

const SelectedProducts = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})

  return (
    <div className="py-6 flex flex-col items-center">
      <ButonSelector refinementList={params} setRefinementList={setParams} />
      <p className="text-[#1F0054] text-[24px] font-black pb-5 w-[90%]">
        ¡Recomendadas para ti!
      </p>
      <InfiniteProducts params={params} />
      <div className="flex w-full justify-center py-5">
        <button
          type="button"
          onClick={() => {}}
          className="border-blue-gf text-blue-gf border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2"
        >
          Ver más
        </button>
      </div>
    </div>
  )
}

export default SelectedProducts
