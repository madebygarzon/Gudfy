"use client"
import React from "react"
import Input from "@modules/common/components/input"
import { medusaClient } from "@lib/config"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { FieldValues, useForm } from "react-hook-form"
import Link from "next/link"

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
  const emailCustomer = decodeURIComponent(email.replace("%40", "@"))
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetCustomerPasswordFormData>()

  const resetPassword = async (data: ResetCustomerPasswordFormData) => {
    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "validate",
        message: "Los campos no coinciden",
      })
      return
    }

    medusaClient.customers
      .resetPassword({
        email: emailCustomer,
        password: data.confirm_password,
        token,
      })
      .then(({ customer }) => {
        setIsRestore(true)
        console.log(customer.id)
      })
      .catch((e) => {
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
      <p className=" w-auto text-center mb-6">{`para la el usuario con el correo ${emailCustomer}`}</p>
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
    <div className="max-w-md w-full flex flex-col items-center shadow-xl rounded-3xl p-12 text-center">
      <h1 className="text-large-semi  text-3xl pb-3">
        ¡Restauracion de contaseña exitosa!
      </h1>
      <p className="w-auto text-[20px] mt-6 cursor-pointer hover:text-blue-800">
        <Link href={"/account/login"} className="text-[20px]">
          {"<- "}Para continuar, inicia sesión con la nueva contraseña{" "}
        </Link>
      </p>
    </div>
  )
}

export default ResetPassword
