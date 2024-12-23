import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar, Progress } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { driver } from "driver.js"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import "driver.js/dist/driver.css"

type DashboardProps = {
  orders?: Order[]
  customer?: Omit<Customer, "password_hash">
}

type Config = {
  nextBtnText?: "Siguiente"
  prevBtnText?: "Atras"
  doneBtnText?: "Salir"
}

// driverObj.drive();

const Dashboard = ({ orders, customer }: DashboardProps) => {
  const { t } = useTranslation("common")
  const { notifications } = useNotificationContext()
  return (
    <div className="w-full  flex items-center justify-center ">
      <div className="w-full grid grid-cols-2 ">
        <div id="sct_per" className="m-2 rounded-lg shadow-2xl p-6">
          <div className=" h-52 w-full flex flex-col items-center justify-center ">
            <div className="flex items-end ">
              <span className="ml-16 text-xs leading-none ">
                Perfil {`${getProfileCompletion(customer)}%`} completado
                {/* {t("acc_ind_completed")} */}
              </span>
            </div>
            <div className="flex items-center gap-10">
              <div className="relative group mb-4">
                <Avatar
                  color="secondary"
                  size="lg"
                  className="w-28 h-28 text-5xl border-solid border-5 border-[#ffffff] opacity-100 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                  name={
                    customer
                      ? customer?.first_name.charAt(0) +
                        customer?.last_name.charAt(0)
                      : " "
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs leading-none  ">
                    {`${getProfileCompletion(customer)}%`}{" "}
                    {t("acc_ind_completed")}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-700 capitalize mb-1">
                  {customer?.first_name} {customer?.last_name}
                </p>
                <span className="font-semibold text-gray-700 mb-3">{customer?.email}</span>
              </div>
            </div>
            <div className="ml-4 flex items-center  text-xs">
              <Cart size={16} className="mr-1" />
              <span>
                {t("acc_ind_purchases")}
                {`: ${orders?.length}`}
              </span>
            </div>
          </div>
        </div>

        <div id="sct_per" className="m-2 rounded-lg shadow-2xl p-6">
          <div className="bg-white h-52 w-full flex flex-col items-center justify-center aspect-square">
            <div className="flex justify-center">
              <Image
                alt="user_gudfy"
                src="/account/user.svg"
                width={80}
                height={80}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl text-gray-700 font-bold ">{t("acc_profile_title")}</h3>

              <p className="text-sm text-center">{t("acc_profile_subtitle")}</p>
              <Link href={"/account/profile"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3 relative"
                >
                  {t("acc_btn_profile")}
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>

        <div id="sct_buy" className="m-2 rounded-lg shadow-2xl p-6">
          <div className="bg-white h-52 w-full flex flex-col items-center justify-center  aspect-square">
            <div className="flex items-center justify-center">
              <Image
                alt="sales_gudfy"
                src="/account/cart.svg"
                width={85}
                height={85}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl text-gray-700 font-bold ">
                {t("acc_purchases_title")}
              </h3>
              <p className="text-sm text-center">
                {t("acc_purchases_subtitle")}
              </p>
              <Link href={"/account/orders"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3 relative"
                >
                  {notifications.map((n) => {
                    if (n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID") {
                      return <Notification />
                    }
                  })}
                  {t("acc_btn_subtitle")}
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div id="sct_spp" className="m-2 rounded-lg shadow-2xl p-6">
          <div className="bg-white h-52 w-full flex flex-col items-center justify-center  aspect-square">
            <div className="flex justify-center">
              <Image
                alt="support_gudfy"
                src="/account/support.svg"
                width={80}
                height={80}
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl text-gray-700 font-bold ">{t("acc_support_title")}</h3>
              <p className="text-sm text-center">{t("acc_support_subtitle")}</p>
              <Link href={"/account/tickets"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3"
                >
                  {t("acc_btn_support")}
                </ButtonLigth>
              </Link>
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
