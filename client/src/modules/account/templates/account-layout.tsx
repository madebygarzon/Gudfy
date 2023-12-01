"use client"

import { useAccount } from "@lib/context/account-context"
import Spinner from "@modules/common/icons/spinner"
import React, { useEffect } from "react"
import AccountNav from "../components/account-nav"

import Logout from "@modules/common/icons/logout"

const AccountLayout: React.FC = ({ children }) => {
  const { customer, retrievingCustomer, checkSession, handleLogout } =
    useAccount()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-[640px] h-full text-gray-900">
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div className="flex-1  small:bg-gray-50 ">
      <div className="flex-1 h-full w-full  bg-white flex flex-col ">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr]   ">
          <div className="bg-[#1F0054] py-10 flex h-[85vh] flex-col justify-between">
            <AccountNav />
            <div className="flex justify-center">
              <button
                className="flex bg-white text-[#1F0054] rounded-[5px] py-2 px-3 min-w-[165px] gap-x-2 items-center justify-center font-bold"
                type="button"
                onClick={handleLogout}
              >
                <Logout size={30} />
                Cerrar sesión
              </button>
            </div>
          </div>

          <div className="h-[85vh] w-full overflow-y-auto flex px-10 justify-center items-center ">
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
