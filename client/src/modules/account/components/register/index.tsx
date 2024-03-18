"use client"
import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { FieldValues, useForm } from "react-hook-form"
import SocialButtons from "@modules/common/components/button_socials"
import Image from "next/image"
import NumberCountry from "@modules/common/components/select_country/selectNumberCountry"
interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

const Register = () => {
  const { refetchCustomer } = useAccount()
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const [codeflag, setcodeFlag] = useState<number>(57)
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
      phone: /^[0-9]+$/,
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
                message: "Numero no valido",
              })
              break
            default:
              true
          }
        }
      } else {
        campo === "phone" ? (isValid = true) : (isValid = false)
      }
    }
    return isValid
  }

  const onSubmit = handleSubmit(async (credentials) => {
    const isValid = await handlerErros(credentials) // rectifica si hay errores
    if (!isValid) return
    if (credentials.phone)
      credentials = {
        ...credentials,
        phone: `(+${codeflag}) ${credentials.phone}`,
      }
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
            refetchCustomer()
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
      <h1 className="text-large-semi text-3xl">Crear una Cuenta</h1>
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
            {...register("first_name", { required: "Primer nombre requerido" })}
            autoComplete="given-name"
            errors={errors}
          />
          <Input
            label="Apellido"
            {...register("last_name", { required: "Segundo nombre requerido" })}
            autoComplete="family-name"
            errors={errors}
          />
          <Input
            label="Correo"
            {...register("email", { required: "Correo requerido" })}
            autoComplete="email"
            errors={errors}
          />
          <div className="flex items-center ">
            <div className="w-[25%]">
              <NumberCountry setCodeFlag={setcodeFlag} />
            </div>
            <div className="w-[75%]">
              <Input
                contentStar={`(+${codeflag})`}
                label="Telefono"
                {...register("phone")}
                autoComplete="phone"
                errors={errors}
                required={false}
              />
            </div>
          </div>

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
          <Link href={"/terms-and-conditions"}>
            los términos y condiciones.
          </Link>
        </span>
        <Button type="submit" className="mt-5 rounded-[5px]">
          Crear
        </Button>
      </form>
      <p className="my-5 font[900] text-sm">O ingresa con:</p>
      <SocialButtons />
    </div>
  )
}

export default Register
