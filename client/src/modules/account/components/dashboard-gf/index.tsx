import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Image from "next/image"

type DashboardProps = {
  orders?: Order[]
  customer?: Omit<Customer, "password_hash">
}

const Dashboard = ({ orders, customer }: DashboardProps) => {
  return (
    <div className="w-full">
      <div className="text-xl-semi capitalize flex justify-between items-start ">
        <span>
          ¡Hola {customer?.first_name} {customer?.last_name}!
        </span>
        <span className="text-small-regular text-gray-700"></span>
      </div>

      <div className=" w-full grid grid-cols-3 gap-2 py-1  justify-center">
        <div className="  row-span-2 ">
          <div className=" flex flex-col relative p-5 h-full shadow-card items-center justify-center rounded-[10px] ">
            <div className="flex  absolute top-2 right-2 items-end gap-x-2 ">
              <span className="text-sm leading-none text-gray-400 uppercase">
                {`${getProfileCompletion(customer)}% completado`}
              </span>
            </div>
            <Avatar
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              className="w-30 h-30 text-large border-solid border-5 border-[#9B48ED]"
            />
            <p className="text-xl-semi capitalize">
              {customer?.first_name} {customer?.last_name}
            </p>
            <span className="font-semibold text-gray-500">
              {customer?.email}
            </span>
            <div className="flex text-gray-400 text-xs mt-[10%]">
              <Cart size={16} /> <span>{`compras: ${orders?.length}`}</span>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <Image
                alt="user_gudfy"
                src="/account/user.svg"
                width={80}
                height={80}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Perfil</h3>

              <p className="text-sm text-center">Edita y completa tu perfil</p>
              <Link href={"/account/profile"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="text-[#9B48ED] mt-3"
                >
                  Editar perfil
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex items-center justify-center">
              <Image
                alt="sales_gudfy"
                src="/account/cart.svg"
                width={85}
                height={85}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Compras</h3>
              <p className="text-sm text-center">
                Encuentra tu listado de ordenes
              </p>
              <Link href={"/account/orders"}>
                <ButtonLigth
                  name="compras"
                  variant="tertiary"
                  className="text-[#9B48ED] mt-3"
                >
                  Lista de compras
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <Image
                alt="support_gudfy"
                src="/account/support.svg"
                width={80}
                height={80}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Soporte</h3>
              <p className="text-sm text-center">
                ¿Tienes alguna pregunta? ¡Envíanos un mensaje!
              </p>
              <Link href={"/account/support"}>
                <ButtonLigth
                  name="soporte"
                  variant="tertiary"
                  className="text-[#9B48ED] mt-3"
                >
                  Contactanos
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div className="min-h-[200px] p-1">
          <div className=" py-5 px-1  h-full shadow-card rounded-[10px] items-center  justify-center">
            <div className="flex justify-center">
              <Image
                alt="wallet_gudfy"
                src="/account/wallet.svg"
                width={70}
                height={70}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold ">Wallet</h3>
              <p className="text-sm text-center">
                Ten control de tu billetera digital
              </p>
              <ButtonLigth
                name="wallet"
                variant="tertiary"
                className="text-[#9B48ED] mt-3"
              >
                Ingresa a tu wallet
              </ButtonLigth>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer?: Omit<Customer, "password_hash">) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  if (customer.billing_address) {
    count++
  }

  return (count / 4) * 100
}
export default Dashboard
