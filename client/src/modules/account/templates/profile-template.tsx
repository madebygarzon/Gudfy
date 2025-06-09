"use client"

import { useAccount } from "@lib/context/account-context"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"
import ProfileBillingAddress from "../components/profile-billing-address"
import ProfilePhone from "../components/profile-phone"
import { Avatar } from "@heroui/react"
import { Customer } from "@medusajs/medusa"
import { getWallet } from "@modules/account/actions/get-wallet"
import { useState, useEffect } from "react"
import { dataWallet } from "./wallet-template"
import ProfileWallet from "../components/profile-wallet"

const ProfileTemplate = () => {
  const { customer, retrievingCustomer, refetchCustomer } = useAccount()

  if (retrievingCustomer || !customer) {
    return null
  }

  const getProfileCompletion = (
    customer: Omit<Customer, "password_hash"> | undefined
  ): number => {
    let count = 0

    if (!customer) return 0

    if (customer.email) count++
    if (customer.first_name && customer.last_name) count++
    if (customer.phone) count++
    if (customer.billing_address) count++

    return (count / 4) * 100
  }

  const [wallet, setWallet] = useState<dataWallet>({
    id: "",
    store_id: "",
    available_balance: 0,
    outstanding_balance: 0,
    balance_paid: 0,
    wallet_address: "",
    payment_request: true,
  })

  const handlerGetWallet = async () => {
    const wallet = await getWallet()
    if (wallet) {
      setWallet(wallet)
    }
  }

  useEffect(() => {
    handlerGetWallet()
  }, [])

  return (
    <div className="h-full flex flex-col lg:flex-row items-center lg:items-center gap-6 p-4 sm:p-2 ">
      {/* Sidebar */}
      <div className="w-full lg:w-4/12 lg:p-6 flex flex-col items-center lg:items-start sm:p-10">
        <div className="mb-6 flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar */}
          <div className="relative group">
            <Avatar
              color="secondary"
              size="lg"
              className="w-24 h-24 md:w-28 md:h-28 text-5xl border-solid border-5 border-white opacity-100 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
              name={
                customer
                  ? customer.first_name.charAt(0) + customer.last_name.charAt(0)
                  : " "
              }
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs leading-none">
                {/* {`${getProfileCompletion(customer)}%`} completado */}
              </span>
            </div>
          </div>

          {/* Profile Header */}
          <div className="text-center lg:text-start">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 capitalize">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full lg:w-8/12 rounded-lg shadow-2xl p-6 ">
        <div className="flex flex-col gap-y-6 w-full">
          <ProfileName customer={customer} />
          <Divider />
          <ProfileEmail customer={customer} />
          <Divider />
          <ProfilePhone customer={customer} />
          <Divider />
          <ProfilePassword customer={customer} />
          <Divider />
          <ProfileWallet wallet={wallet} customer={customer} onWalletUpdate={handlerGetWallet} />
        </div>
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}

export default ProfileTemplate
