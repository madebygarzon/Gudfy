"use client"
import { Avatar, useDisclosure } from "@nextui-org/react"
import { StoreVariant, StoreData } from "@modules/seller-store/templates"
import { BsCart } from "react-icons/bs"
import { MdOutlineStar } from "react-icons/md"
import ModalSellerStoreReviews from "../store-reviews"
import { useRouter } from "next/navigation"

const SellerProfile: React.FC<{ store: StoreData }> = ({ store }) => {
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  return (
    <div>
      <Avatar
        size="lg"
        src={store.avatar || " "}
        className=" w-[180px] h-[180px] border-solid border-5 border-[#9B48ED] text-3xl text-lila-gf font-extrabold"
      />
      <h2 className="text-2xl mt-2 font-bold text-gray-700 capitalize">
        {store.store_name}
      </h2>
      <div className="text-gray-500 mb-2 flex justify-between mt-2 text-sm">
        <p className=" ">Valoraciones: </p>
        <p className="flex justify-between items-center w-1/4 font-bold">
          <MdOutlineStar color={"#9B48ED"} /> {store.store_rating}%
        </p>
      </div>
      <div className="text-gray-600 font-medium flex justify-between mt-2 text-sm">
        <p className="">Ventas: </p>
        <p className="flex justify-between items-center w-1/4  font-bold">
          <BsCart color={"#9B48ED"} /> {store.store_number_sales.numberSales}
        </p>
      </div>

      <div>
        <p onClick={onOpen} className="text-lila-gf cursor-pointer mt-5">
          Ver reseñas
        </p>

        <ModalSellerStoreReviews
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
          store_id={store.store_id}
          store_name={store.store_name}
          store_avatar={store.avatar}
        />
      </div>
    </div>
  )
}

export default SellerProfile
