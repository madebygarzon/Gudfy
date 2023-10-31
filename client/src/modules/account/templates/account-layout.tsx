"use client"

import { useAccount } from "@lib/context/account-context"
import UnderlineLink from "@modules/common/components/underline-link"
import Spinner from "@modules/common/icons/spinner"
import React, { useEffect } from "react"
import AccountNav from "../components/account-nav"
import Image from "next/image"

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
          <div className="bg-[#1F0054] py-10 flex h-[80vh] flex-col justify-between">
            <AccountNav />
            <div className="flex justify-center">
              <button
                className="flex bg-white text-[#1F0054] rounded-[5px] py-2 px-3 min-w-[165px] gap-x-2 items-center justify-center font-bold"
                type="button"
                onClick={handleLogout}
              >
                <Image
                  alt=""
                  src={"/account/cerrarSesion.svg"}
                  width={30}
                  height={30}
                />
                Cerrar sesión
              </button>
            </div>
          </div>
          <div className=" m-2 max-h-[70vh] overflow-y-auto">
            <div className="flex p-10  justify-center  max-w-[1400px]  min-w-[300px]  ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
