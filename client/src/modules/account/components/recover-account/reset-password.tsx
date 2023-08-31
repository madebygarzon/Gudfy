"use client"
import React from "react"
import Input from "@modules/common/components/input"
import { medusaClient } from "@lib/config"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { FieldValues, useForm } from "react-hook-form"
import Image from "next/image"

type ResetCustomerPasswordFormData = {
  new_password: string
  confirm_password: string
}
type tokenData = {
  token: string
  email: string
}

const ResetPassword: React.FC<tokenData> = ({ token, email }) => {
  const [isRestored, setIsRestore] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetCustomerPasswordFormData>()

  const resetPassword = async (data: ResetCustomerPasswordFormData) => {
    console.log(decodeURIComponent(email.replace('%40', '@')))
    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "validate",
        message: "Los campos no coinciden",
      })
      return
    }

    medusaClient.customers
      .resetPassword({
        email:  decodeURIComponent(email.replace('%40', '@')),
        password: data.confirm_password,
        token,
      })
      .then(({ customer }) => {
        setIsRestore(true)
        console.log(customer.id)
      }).catch((e)=>{
        console.log(e)
      })
  }
 
  return !isRestored ? (
    <div className="max-w-md w-full flex flex-col items-center">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h1 className="text-large-semi  text-3xl">Cambiar Contraseña</h1>
      <p className=" mb-6">{`para la el usuario con el correo ${email}`}</p>
      <form
        onSubmit={handleSubmit(resetPassword)}
        onReset={() => reset()}
        className="w-full font[400] shadow-xl border-2 rounded-3xl p-12 flex flex-col items-center "
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nueva Contaseña"
            type="password"
            {...register("new_password", { required: true })}
            errors={errors}
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            {...register("confirm_password", { required: true })}
            errors={errors}
          />
        </div>
        <Button className=" mt-6 rounded-[5px]">Restablecer</Button>
      </form>
    </div>
  ) : (
    <div></div>
  )
}

export default ResetPassword
