import Button from "@modules/common/components/button"
import Icon from "@modules/common/icons/coin"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Cart from "@modules/common/icons/cart"
import Notification from "@modules/common/components/notification"
import { useNotificationContext } from "@lib/context/notification-context"
import { useTranslation } from "react-i18next"

const AccountNav = () => {
  const route = usePathname()
  const { notifications } = useNotificationContext()
  const { t } = useTranslation("common")

  return (
    <div>
      <div className="small:hidden">
        {route !== "/account" && (
          <Link
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
          ></Link>
        )}
      </div>
      <div className=" hidden sm:block ">
        <div>
          <div className="text-base h-full flex flex-col justify-start items-center">
            <ul className="mb-auto flex flex-col gap-y-4">
              <li id="btn_left_dhb" className="relative">
                {notifications.map((n) => {
                  if (n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID") {
                    return <Notification />
                  }
                })}
                <Button variant="selected" href="/account" route={route!}>
                  <Cart size={30} />
                  {t("acc_btn_buyer")}
                </Button>
              </li>
              <li id="btn_left_str" className="relative">
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
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountNav
