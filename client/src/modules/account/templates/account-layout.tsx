"use client"

import { useAccount } from "@lib/context/account-context"
import React, { useEffect } from "react"
import AccountNav from "../components/account-nav"
import { useTranslation } from "react-i18next"
import Logout from "@modules/common/icons/logout"
import Button from "@modules/common/components/button"
import Cart from "@modules/common/icons/cart"
import { usePathname } from "next/navigation"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import Icon from "@modules/common/icons/coin"
import Loader from "@lib/loader"

const AccountLayout: React.FC = ({ children }) => {
  const { t } = useTranslation("common")
  const route = usePathname()
  const { notifications } = useNotificationContext()
  const { customer, retrievingCustomer, checkSession, handleLogout } =
    useAccount()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-[640px] h-full text-gray-900">
        <Loader />
      </div>
    )
  }

  return (
    <div className="flex-1  small:bg-gray-50 ">
      <div className="flex-1 h-full w-full  bg-white flex flex-col ">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr]   ">
          <div className="bg-[#1F0054] py-10 flex h-36 sm:h-[85vh] sm:flex-col items-center justify-between ">
            <div className="hidden sm:block">
              <AccountNav />
            </div>

            <div className="flex justify-center items-center">
              <button
                className="hidden sm:flex bg-white text-[#1F0054] rounded-[5px] py-2 px-3 min-w-[165px] gap-x-2 items-center justify-center font-bold"
                type="button"
                onClick={handleLogout}
              >
                <Logout size={30} />
                {t("account_menu_lg")}
              </button>
              <div className="sm:hidden flex justify-center items-center gap-x-4 mt-2">
                <Button variant="selected" href="/account" route={route!}>
                  <Cart size={30} />
                  {t("acc_btn_buyer")}
                </Button>

                <Button
                  variant="selected"
                  href="/account/seller"
                  route={route!}
                  className=" "
                >
                  {notifications.map((n) => {
                    if (n.notification_type_id === "NOTI_CLAIM_SELLER_ID") {
                      return <Notification />
                    }
                  })}
                  <Icon size={30} />
                  {t("acc_btn_seller")}
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[85vh] w-full overflow-y-auto flex py-5 px-10 justify-center items-center ">
            <div className="w-full h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
