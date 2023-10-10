"use client"
import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { Checkbox } from "@nextui-org/checkbox"
import Link from "next/link"
import RecoverAccount from "../recover-account"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
}

const LoginLight = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const [isRecovery, setIsRecovery] = useState<boolean>(false)

  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInCredentials>()

  function handlerErros(credenciales: SignInCredentials) {
    let isValid = true
    const validaciones: Record<keyof SignInCredentials, RegExp> = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    }

    if (!credenciales.email) {
      isValid = false
      setError("email", {
        type: "validate",
        message: "Ingresa un valor",
      })
    }
    if (!validaciones.email.test(credenciales.email)) {
      isValid = false
      setError("email", {
        type: "validate",
        message: "Ingrese un correo valido",
      })
    }

    return isValid
  }

  const onSubmit = handleSubmit(async (credentials) => {
    const isValid = await handlerErros(credentials)
    if (!isValid) return
    await medusaClient.auth
      .authenticate(credentials)
      .then(() => {
        refetchCustomer()
      })
      .catch(handleError)
  })

  return !isRecovery ? (
    <div className="max-w-md w-full flex flex-col items-center">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}

      <h1 className="text-large-semi  mb-6 text-3xl">Iniciar Sesión</h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        ¿Nuevo usuario? <Link href={"/account/register"}>Crear una cuenta</Link>
        .
      </p>
      <form
        className="w-full font[400] shadow-xl border-2 rounded-3xl p-12 flex flex-col items-center "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre de usuario"
            {...register("email", {
              required: "Correo electronico es requerido",
            })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Contraseña"
            {...register("password", { required: "Se requiere contraseña" })}
            type="password"
            autoComplete="current-password"
            errors={errors}
          />
        </div>
        <div className="flex w-full pt-[10px] justify-between items-center">
          <Checkbox defaultSelected radius="full" color="secondary">
            Recuérdame
          </Checkbox>
          <p
            className="w-[120px] cursor-pointer hover:text-blue-800"
            onClick={() => setIsRecovery(true)}
          >
            ¿Has olvidado la contraseña?
          </p>
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              Estas credenciales no coinciden con nuestros registros
            </span>
          </div>
        )}
        <div className="mx-max felx justify-center">
          <Button className=" mt-6 rounded-[5px]">Accerder</Button>
        </div>
      </form>
    </div>
  ) : (
    <RecoverAccount setIsRecovery={setIsRecovery} />
  )
}

export default LoginLight
