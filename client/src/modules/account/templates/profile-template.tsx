"use client"

import { useAccount } from "@lib/context/account-context"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"
import ProfileBillingAddress from "../components/profile-billing-address"
import ProfilePhone from "../components/profile-phone"
import { Avatar } from "@nextui-org/react"
import { Customer } from "@medusajs/medusa"

const ProfileTemplate = () => {
  const { customer, retrievingCustomer, refetchCustomer } = useAccount()

  if (retrievingCustomer || !customer) {
    return null
  }

  const getProfileCompletion = (
    customer: Omit<Customer, "password_hash"> | undefined
  ): number => {
    let count = 0

    if (!customer) {
      return 0
    }

    if (customer.email) count++
    if (customer.first_name && customer.last_name) count++
    if (customer.phone) count++
    if (customer.billing_address) count++

    return (count / 4) * 100
  }

  return (
    <div className="h-full flex items-center">
      <div className="w-4/12 p-8">        
        <div className="mb-8 flex gap-4 items-center">
          {/* Avatar */}
          <div className="flex items-center relative group mb-4">
            <Avatar
              color="secondary"
              size="lg"
              className="w-28 h-28 text-5xl border-solid border-5 border-[#ffffff] opacity-100 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
              name={
                customer
                  ? customer.first_name.charAt(0) + customer.last_name.charAt(0)
                  : " "
              }
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs leading-none">
                {`${getProfileCompletion(customer)}%`} completado
              </span>
            </div>
          </div>

          {/* Profile Header */}
          <div className="text-start">
            <h1 className="text-2xl font-bold text-gray-700 capitalize">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-base-regular text-gray-600">{customer.email}</p>
          </div>
        </div>
      </div>
      <div className="w-8/12 mr-6 rounded-lg shadow-2xl p-8">
        {/* Profile Information */}
        <div className="flex pl-2 flex-col gap-y-8 w-full">
          <ProfileName customer={customer} />
          <Divider />
          <ProfileEmail customer={customer} />
          <Divider />
          <ProfilePhone customer={customer} />
          <Divider />
          <ProfilePassword customer={customer} />
          {/* <Divider /> */}
          {/* <ProfileBillingAddress customer={customer} /> */}
        </div>
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}

export default ProfileTemplate
