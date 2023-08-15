"use client"
import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { BsFacebook } from "react-icons/bs"
import {FcGoogle} from "react-icons/fc"
import { Checkbox } from "@nextui-org/checkbox" 
import Link from "next/link"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
}

const LoginComponente = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()

  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInCredentials>()

  const onSubmit = handleSubmit(async (credentials) => {
    await medusaClient.auth
      .authenticate(credentials)
      .then(() => {
        refetchCustomer()
        router.push("/account")
      })
      .catch(handleError)
  })

  return (
    <div className="max-w-md w-full flex flex-col items-center">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}

      <h1 className="text-large-semi  mb-6 text-3xl">Iniciar Sesión</h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        ¿Nuevo usuario? <Link href={"./register"}>Crear una cuenta</Link>.
      </p>
      <form
        className="w-full font[400] shadow-xl border-2 rounded-3xl p-12 flex flex-col items-center "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre de usuario"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Contraseña"
            {...register("password", { required: "Password is required" })}
            type="password"
            autoComplete="current-password"
            errors={errors}
          />
        </div>
        <div className="flex w-full pt-[10px] justify-between items-center">
        <Checkbox defaultSelected radius="full" color="secondary" >Recuérdame</Checkbox>
        <p className="w-[120px]">¿Has olvidado la contraseña?</p>
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
            Estas credenciales no coinciden con nuestros registros
            </span>
          </div>
        )}
        <div className="mx-max felx justify-center">
          <Button className=" mt-6 rounded-full">Accerder</Button>
        </div>
      </form>
      <p className="mt-5 font[900] text-xs">O ingresa con:</p>
      <div className="flex gap-4 pt-2">
        <BsFacebook className="p-[4px] bg-blue-500" color="white" size={35}/>
        <FcGoogle className="p-[1px] border border-blue-500" color="white" size={35}/>
      </div>
    </div>
  )
}

export default LoginComponente
