"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAccount } from "@lib/context/account-context"
import { useTranslation } from "react-i18next"
import { Badge, Avatar } from "@heroui/react"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"

type DropdownProps = {
  name: string
}

const DropdownGudFyLog: React.FC<DropdownProps> = ({ name }) => {
  const { handleLogout } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  const { t } = useTranslation("common")

  const { notifications } = useNotificationContext()

  // No items array - using explicit items

  return (
    <div
      className="relative flex items-center gap-x-1 "
      onMouseEnter={() => setIsOpen(!isOpen)}
      onMouseLeave={() => setIsOpen(!isOpen)}
    >
      <div className=" flex items-center text-[#FFFFFF] font-[500] text-[14px]  ">
        <div className="relative">
          <Image
            className="mr-1"
            alt="user_gudfy"
            src="/header/user-icon.svg"
            width={32}
            height={32}
          />
          {notifications?.length  ? (
            <Notification count={notifications.length} />
          ) : (
            <></>
          )}
        </div>

        {name}
        <svg
          className="-mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute w-max top-[18px] sm:top-[33px] gap-x-4 gap-y-2">
          <div className="relative bg-blue-gf top-[27px]">
            <Link
              href="/account"
              className="block px-7 py-2 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
            >
              {notifications.map((n) => {
                if (
                  n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID" ||
                  (n.notification_type_id === "NOTI_CLAIM_SELLER_ID")
                ) {
                  return <Notification />
                }
              })}
              {t("account_menu_cp")}
            </Link>
            <Link
              href="/account/orders"
              className="block px-7 py-2 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
            >
              {t("account_menu_mo")}
            </Link>
            <Link
              href="/account/profile"
              className="block px-7 py-2 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
            >
              {t("account_menu_ep")}
            </Link>
            <Link
              href="/cart"
              className="block px-7 py-2 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
            >
              {t("account_menu_mc")}
            </Link>
            <Link
              href="/"
              className="block px-7 py-2 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleLogout()}
            >
              {t("account_menu_lg")}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownGudFyLog
