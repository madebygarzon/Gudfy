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
import { FcGoogle } from "react-icons/fc"
import { Checkbox } from "@nextui-org/checkbox"
import Link from "next/link"
import Image from "next/image"
import RecoverAccount from "../recover-account"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
}

const LoginComponente = () => {
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
        router.push("/account")
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
        ¿Nuevo usuario? <Link href={"./register"}>Crear una cuenta</Link>.
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
      <p className="mt-5 font[900] text-sm">O ingresa con:</p>
      <div className="flex gap-4 pt-2">
        <a
          href="http://localhost:9000/store/auth/facebook" // deberia de ser una variable de entorno
          type="button"
          className="text-white  bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2 w-32 justify-center"
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="facebook-f"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
            ></path>
          </svg>
          Facebook
        </a>
        <a
          type="button"
          href="http://localhost:9000/store/auth/google" // deberia de ser una variable de entorno
          className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 w-32 justify-center"
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Google
        </a>
        <a
          type="button"
          href="http://localhost:9000/store/auth/google" // deberia de ser una variable de entorno
          className="text-white bg-[#402e72] hover:bg-blue-gf focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 w-32 justify-center"
        >
          <Image
            className="ml-auto mr-auto"
            alt="gudfy"
            src="/footer/gudfy_logo_2.svg"
            width={251.76}
            height={81.63}
          />
        </a>
      </div>
    </div>
  ) : (
    <RecoverAccount setIsRecovery={setIsRecovery} />
  )
}

export default LoginComponente
