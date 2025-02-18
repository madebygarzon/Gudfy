import { medusaClient } from "@lib/config"
import { Customer } from "@medusajs/medusa"
import Input from "@modules/common/components/input"
import { useUpdateMe } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import AccountInfo from "../account-info"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerPasswordFormData = {
  old_password: string
  new_password: string
  confirm_password: string
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<UpdateCustomerPasswordFormData>()

  const {
    mutate: update,
    isLoading,
    isSuccess,
    isError,
    reset: clearState,
  } = useUpdateMe()

  useEffect(() => {
    reset()
    setErrorMessage(undefined) // Limpiar mensajes de error al resetear el formulario
  }, [customer, reset])

  const updatePassword = async (data: UpdateCustomerPasswordFormData) => {
    setErrorMessage(undefined) // Limpiar mensajes previos

    const isValid = await medusaClient.auth
      .authenticate({
        email: customer.email,
        password: data.old_password,
      })
      .then(() => true)
      .catch(() => false)

    if (!isValid) {
      setError("old_password", {
        type: "validate",
        message: "La contraseña actual es incorrecta",
      })
      setErrorMessage("La contraseña actual es incorrecta")
      return
    }

    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "validate",
        message: "Las contraseñas no coinciden",
      })
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    return update({
      id: customer.id,
      password: data.new_password,
    })
  }

  return (
    <form
      onSubmit={handleSubmit(updatePassword)}
      onReset={() => reset()}
      className="w-full"
    >
      <AccountInfo
        label="Contraseña"
        currentInfo={<span className="font-extrabold">********</span>}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contraseña actual"
            {...register("old_password", {
              required: "Este campo es obligatorio",
            })}
            type="password"
            errors={errors}
          />
          <Input
            label="Nueva Contraseña"
            type="password"
            {...register("new_password", {
              required: "Este campo es obligatorio",
            })}
            errors={errors}
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            {...register("confirm_password", {
              required: "Este campo es obligatorio",
            })}
            errors={errors}
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
