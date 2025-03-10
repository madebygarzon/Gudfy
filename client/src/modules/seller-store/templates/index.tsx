"use client"
import { Avatar } from "@nextui-org/react"
import { Input } from "@medusajs/ui"
import React from "react"
import SellerProfile from "../components/seller-profile"
import SellerProductTable from "../components/seller-products-table"
import ButtonLigth from "@modules/common/components/button_light"
import { useRouter } from "next/navigation"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"

export interface StoreVariant {
  store_variant_id: string
  quantity: number
  price: number
  titleVariant: string
  parent_title: string
  thumbnail: string
  desciption: string
}

export interface StoreData {
  store_id: string
  avatar: string
  store_name: string
  store_rating: number
  store_number_sales: { numberSales: 5; productCount: 5 }
  variants: StoreVariant[]
}

const SellerStore: React.FC<{ store: StoreData }> = ({ store }) => {
  const router = useRouter()
  return (
    <div className="my-10 mx-4 sm:mx-10 md:mx-20">
      <div className="flex flex-col md:flex-row p-4 rounded-lg gap-6">
        {/* Contenedor de SellerProfile */}
        <div className="w-full md:w-[25%] bg-white p-4 rounded-lg shadow-2xl flex flex-col items-center justify-center text-center">
          <SellerProfile store={store} />
        </div>
        {/* Contenedor de SellerProductTable */}
        <div className="w-full md:w-[75%] mt-6 md:mt-0">
          <SellerProductTable store={store} />
        </div>
      </div>
    </div>
  )
}

export default SellerStore
