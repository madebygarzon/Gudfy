import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar } from "@nextui-org/react"
import User from "@modules/common/icons/user"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Support from "@modules/common/icons/support"
import Wallet from "@modules/common/icons/wallet"

type DashboardProps = {
  orders?: Order[]
  customer?: Omit<Customer, "password_hash">
}

const Dashboard = ({ orders, customer }: DashboardProps) => {
  return (
    <div className="w-full">
      <div className="text-xl-semi capitalize flex justify-between items-start mb-4">
        <span>
          ¡Hola {customer?.first_name} {customer?.last_name}!
        </span>
        <span className="text-small-regular text-gray-700"></span>
      </div>
      <div className=" w-full grid grid-cols-3 gap-2 py-1  justify-center">
        <div className="  row-span-2 ">
          <div className=" flex flex-col p-5 h-full shadow-card items-center justify-center rounded-[10px] ">
            <Avatar
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              className="w-30 h-30 text-large border-solid border-5 border-[#9B48ED]"
            />
            <p className="text-xl-semi capitalize">
              {customer?.first_name} {customer?.last_name}
            </p>
            <span className="font-semibold">{customer?.email}</span>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <User
                size={70}
                className="p-1 border-5 border-[#9B48ED]  rounded-full "
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Perfil</h3>
              <p className="text-sm text-center">Edita y completa tu perfil</p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a perfil
              </ButtonLigth>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex items-center justify-center">
              <Cart
                size={70}
                className="p-1 border-5 border-[#9B48ED]  rounded-full "
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Compras</h3>
              <p className="text-sm text-center">
                Encuentra tu listado de ordenes
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a compras
              </ButtonLigth>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <Support
                size={70}
                className="p-1 border-5 border-[#9B48ED]  rounded-full "
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Asistencia</h3>
              <p className="text-sm text-center">
                ¿Tienes alguna pregunta? ¡Envíanos un mensaje!
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a Asistencia
              </ButtonLigth>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <Wallet
                size={70}
                className="p-1 border-5 border-[#9B48ED]  rounded-full "
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Wallet</h3>
              <p className="text-sm text-center">
                Ten control de tu billetera digital
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a wallet
              </ButtonLigth>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
