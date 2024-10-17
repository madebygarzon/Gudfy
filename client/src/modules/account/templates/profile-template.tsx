"use client"

import { useAccount } from "@lib/context/account-context"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"
import ProfileBillingAddress from "../components/profile-billing-address"
import ProfilePhone from "../components/profile-phone"

const ProfileTemplate = () => {
  const { customer, retrievingCustomer, refetchCustomer } = useAccount()

  if (retrievingCustomer || !customer) {
    return null
  }

  return (
    <div className="mb-10 border-1 border-[#c7c7c7] rounded-30 p-11 w-8/12 mx-auto">
      <div className="">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl-semi">Perfil</h1>
          <p className="text-base-regular">
            Ver y actualizar la información de su perfil, incluido su nombre,
            correo electrónico, y número de teléfono. También puede actualizar su
            cambiar tu contraseña.
          </p>
        </div>
        <div className="flex flex-col gap-y-8 w-full">
          <ProfileName customer={customer} />
          <Divider />
          <ProfileEmail customer={customer} />
          <Divider />
          <ProfilePhone customer={customer} />
          <Divider />
          <ProfilePassword customer={customer} />
          <Divider />
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
