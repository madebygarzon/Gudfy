import React from "react"
import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Product from "@modules/common/icons/package"
import Image from "next/image"
import { useCustomerOrders, useMeCustomer } from "medusa-react"
import { Progress } from "@nextui-org/react"

const CustomerStore = (store: any) => {
  const { orders } = useCustomerOrders()
  const { customer } = useMeCustomer()
  return (
    <div className="w-full pb-5">
      <div className="text-xl-semi flex justify-between items-start ">
        <span>
          ¡Tu tienda{" "}
          <span className=" text-xl-semi capitalize">
            {customer?.first_name} {customer?.last_name}
          </span>
          !
        </span>
        <span className="text-small-regular text-gray-700"></span>
      </div>
      <div className="flex my-4 gap-2">
        <div className="w-[40%] flex justify-center ">
          <CardPrefileDashboard customer={customer} />
        </div>
        <div className=" w-[60%] flex justify-center ">
          <CardReviewProductDashboard />
        </div>
      </div>
      <div className=" w-full grid grid-cols-4 gap-2 py-1   ">
        <CardItemsDashboard
          image="/account/product.svg"
          title="Productos"
          description=" Crea, edita y gestiona tus productos"
          href="/account/seller/products"
        />

        <CardItemsDashboard
          image="/account/metricas.svg"
          title="Ordenes"
          description=" Mira el proseso de tus ordenes"
          href="/account/profile"
        />

        <CardItemsDashboard
          image="/account/cart.svg"
          title="Ventas"
          description="Gestiona y analisa tus ventas"
          href="/account/profile"
        />

        <CardItemsDashboard
          image="/account/support.svg"
          title="Ayuda"
          description="Contactanos"
          href="/account/profile"
        />
      </div>
    </div>
  )
}

interface CardDasboard {
  image: string
  alt?: string
  title: string
  description: string
  href: string
}

const CardItemsDashboard: React.FC<CardDasboard> = ({
  image,
  title,
  description,
  href,
}) => {
  return (
    <div className="min-h-[200px] max-w-[300px]">
      <Link href={href}>
        <div className=" flex flex-col py-5 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
          <Image alt="user_gudfy" src={image} width={80} height={80} />
          <h3 className="text-2xl font-bold ">{title}</h3>
          <p className="text-sm text-center">{description}</p>
        </div>
      </Link>
    </div>
  )
}

const CardReviewProductDashboard: React.FC = () => {
  return (
    <div className=" min-h-[200px] w-full flex flex-col py-5 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
      <div className="text-center">
        <h3 className="text-4xl font-bold -mb-2 ">80</h3>
        <p className="text-sm ">Valoraciones a productos</p>
      </div>
      <div className="flex w-[100%] max-w-md justify-center mt-2">
        <div className=" w-[60%] z-20">
          <Progress color="primary" value={100} />
        </div>
        <div className="w-[30%] z-10 -ml-4 ">
          <Progress color="warning" value={100} />
        </div>
        <div className="w-[10%] z-0 -ml-4">
          <Progress color="danger" value={100} />
        </div>
      </div>
      <div className=" flex w-full justify-between px-10 mt-10">
        <div className="">
          <div className=" flex gap-1 items-center justify-center">
            <h3 className="text-xl font-bold  ">48</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-blue-500"></div>
          </div>
          <p className="text-sm ">5-4 Estrellas</p>
        </div>
        <div className="text-center">
          <div className=" flex gap-1 items-center justify-center">
            <h3 className="text-xl font-bold  ">24</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-warning-500"></div>
          </div>
          <p className="text-sm ">3-2 Estrellas</p>
        </div>
        <div className="text-center">
          <div className=" flex gap-1 items-center justify-center">
            <h3 className="text-xl font-bold  ">8</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-danger-500"></div>
          </div>
          <p className="text-sm ">1-0 Estrellas</p>
        </div>
      </div>
    </div>
  )
}
interface CardPrefileDashboard {
  customer: Omit<Customer, "password_hash"> | undefined
}

const CardPrefileDashboard: React.FC<CardPrefileDashboard> = ({ customer }) => {
  return (
    <div className="flex flex-col w-full  py-5 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
      <Avatar
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
        className=" w-[100px]  h-[100px] border-solid border-5 border-[#9B48ED]"
      />
      <p className="text-xl-semi capitalize">
        {customer?.first_name} {customer?.last_name}
      </p>
      <span className="font-semibold text-gray-500">{customer?.email}</span>
      <div className="flex gap-2 my-4">
        <div className="flex text-gray-400 text-xs ">
          <Cart size={16} /> <p className="text-[10px]">{`(10) Ventas`}</p>
        </div>
        <div className="flex text-gray-400 text-xs ">
          <Product size={16} />{" "}
          <p className="text-[10px]">{`(13) Productos`}</p>
        </div>
      </div>
    </div>
  )
}
export default CustomerStore
