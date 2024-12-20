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
    <div className="my-10 mx-20  ">
      

      <div className="flex flex-col md:flex-row p-4 rounded-lg  ">
        {/* Sección de la Información del Vendedor */}
        <div className="w-[20%] bg-white p-4 rounded-lg shadow-2xl flex flex-col items-center  justify-center text-center">
          <SellerProfile store={store} />
        </div>

        {/* Sección de los Productos */}
        <div className=" w-[80%] mt-6 md:mt-0 md:ml-6 ">
          <SellerProductTable store={store} />
        </div>
      </div>
    </div>
  )
}

export default SellerStore
