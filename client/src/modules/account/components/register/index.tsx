"use client"
import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

const Register = () => {
  //const { loginView, refetchCustomer } = useAccount()
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const handleError = (e: Error) => {
    setAuthError("Algo salio mal")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterCredentials>()

  function handlerErros(credenciales: RegisterCredentials) {
    let isValid = true
    const validaciones: Record<keyof RegisterCredentials, RegExp> = {
      first_name: /^[a-zA-Z\s]+$/,
      last_name: /^[a-zA-Z\s]+$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      phone: /^[0-9]{10,}$/,
    }

    for (const campo in validaciones) {
      if (credenciales[campo]) {
        if (!validaciones[campo].test(credenciales[campo])) {
          isValid = false
          switch (campo) {
            case "first_name":
              setError("first_name", {
                type: "validate",
                message: "Solo se aceptan caracteres alfabéticos ",
              })
              break
            case "last_name":
              setError("last_name", {
                type: "validate",
                message: "Solo se aceptan caracteres alfabéticos ",
              })
              break
            case "email":
              setError("email", {
                type: "validate",
                message: "Correo no aceptado ",
              })
              break
            case "password":
              setError("password", {
                type: "validate",
                message:
                  "Debe contener una letra minúscula, una letra mayúscula, un dígito y una longitud mínima de 8 caracteres ",
              })
              break
            case "phone":
              setError("phone", {
                type: "validate",
                message: "Numero no valido ",
              })
              break
          }
        }
      } else {
        campo === "phone" ? (isValid = true) : (isValid = false)
      }
    }

    return isValid
  }

  const onSubmit = handleSubmit(async (credentials) => {
    const isValid = await handlerErros(credentials)
    if (!isValid) return
    await medusaClient.auth.exists(credentials.email).then(async (e) => {
      if (e.exists) {
        setError("email", {
          type: "validate",
          message: "este correo ya esta en uso",
        })
      } else {
        await medusaClient.customers
          .create(credentials)
          .then(() => {
            router.push("/account")
          })
          .catch(handleError)
      }
    })
  })

  return (
    <div className="max-w-md w-full flex flex-col items-center">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h1 className="text-large-semi  mb-6 text-3xl">Crear una Cuenta</h1>
      <p className="text-center text-base-regular text-gray-700  font-[500] mb-4">
        ¿Ya tienes una cuenta? <Link href={"./login"}>Accede</Link>
      </p>
      <form
        className="w-full font[400] shadow-xl border-2 rounded-3xl p-10 flex flex-col items-center"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre"
            {...register("first_name", { required: "First name is required" })}
            autoComplete="given-name"
            errors={errors}
          />
          <Input
            label="Apellido"
            {...register("last_name", { required: "Last name is required" })}
            autoComplete="family-name"
            errors={errors}
          />
          <Input
            label="Correo"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Telefono"
            {...register("phone")}
            autoComplete="tel"
            errors={errors}
          />
          <Input
            label="Contraseña"
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            autoComplete="new-password"
            errors={errors}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              Algunas credenciales no están permitidas
            </span>
          </div>
        )}
        <span className="text-center text-gray-700 text-small-regular mt-6">
          Acepto{" "}
          <Link href={"https://gudfy.com/terminos-y-condiciones/"}>
            los términos y condiciones.
          </Link>
        </span>
        <Button className="mt-6 rounded-full">Entrar</Button>
      </form>
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
      </div>
    </div>
  )
}

export default Register
