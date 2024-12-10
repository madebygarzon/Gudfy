import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar, Progress } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { driver } from "driver.js"
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
  return (
    <div className="w-full sectionFull ">
      <div className="panel_admin w-full grid grid-cols-3 gap-2 py-1  justify-center">
        <div className="bg-[#1F0054] row-span-2 rounded-[10px] text-white">
          <div className=" flex flex-col relative p-5 h-full shadow-card items-center justify-center rounded-[10px] ">
            <div className="flex  absolute top-2 right-2 items-end gap-x-2 ">
              <span className="text-xs leading-none text-white ">
                {`${getProfileCompletion(customer)}%`} {t("acc_ind_completed")}
              </span>
            </div>
            <div className="relative group">
              <Avatar
                color="secondary"
                size="lg"
                className="w-40 h-40 text-5xl border-solid border-5 border-[#ffffff] opacity-100 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                name={
                  customer
                    ? customer?.first_name.charAt(0) +
                      customer?.last_name.charAt(0)
                    : " "
                }
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm leading-none text-white uppercase">
                  {`${getProfileCompletion(customer)}%`}{" "}
                  {t("acc_ind_completed")}
                </span>
              </div>
            </div>
            <p className="text-xl-semi capitalize">
              {customer?.first_name} {customer?.last_name}
            </p>
            <span className="font-semibold text-white">{customer?.email}</span>
            <div className="flex text-white text-xs mt-[10%]">
              <Cart size={16} />{" "}
              <span>
                {t("acc_ind_purchases")}
                {`: ${orders?.length}`}
              </span>
            </div>
          </div>
        </div>
        <div id="sct_per" className="min-h-[200px] p-1">
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
              <h3 className="text-2xl font-bold ">{t("acc_profile_title")}</h3>

              <p className="text-sm text-center">{t("acc_profile_subtitle")}</p>
              <Link href={"/account/profile"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3"
                >
                  {t("acc_btn_profile")}
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div id="sct_buy" className="min-h-[200px] p-1">
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
              <h3 className="text-2xl font-bold ">
                {t("acc_purchases_title")}
              </h3>
              <p className="text-sm text-center">
                {t("acc_purchases_subtitle")}
              </p>
              <Link href={"/account/orders"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3"
                >
                  {t("acc_btn_subtitle")}
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div>
        <div id="sct_spp" className="min-h-[200px] p-1">
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
              <h3 className="text-2xl font-bold ">{t("acc_support_title")}</h3>
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

        {/* <div id="sct_wal" className="min-h-[200px] p-1">
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
              <h3 className="text-2xl font-bold ">{t('acc_wallet_title')}</h3>
              <p className="text-sm text-center">
                {t('acc_wallet_subtitle')}
              </p>
              <Link href={"/account/wallet"}>
                <ButtonLigth
                  name="perfil"
                  variant="tertiary"
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3"
                >
                  {t('acc_btn_wallet')}
                </ButtonLigth>
              </Link>
            </div>
          </div>
        </div> */}
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
