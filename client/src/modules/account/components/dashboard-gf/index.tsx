import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar } from "@nextui-org/react"
import User from "@modules/common/icons/user"
import ButtonLigth from "@modules/common/components/button_light"

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
      <div className=" w-full grid grid-cols-3 gap-4">
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
              <p className="text-sm text-center">
                aca va el contenido de lo que se espera
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a
              </ButtonLigth>
            </div>
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
              <p className="text-sm text-center">
                aca va el contenido de lo que se espera
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a
              </ButtonLigth>
            </div>
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
              <p className="text-sm text-center">
                aca va el contenido de lo que se espera
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a
              </ButtonLigth>
            </div>
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
              <p className="text-sm text-center">
                aca va el contenido de lo que se espera
              </p>
              <ButtonLigth variant="tertiary" className="text-[#9B48ED] mt-3">
                Ir a
              </ButtonLigth>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
