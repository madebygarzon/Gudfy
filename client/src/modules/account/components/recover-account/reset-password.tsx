'use client'
import React from  "react"
import Input from "@modules/common/components/input"
import { medusaClient } from "@lib/config"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { FieldValues, useForm } from "react-hook-form"


type ResetCustomerPasswordFormData =  {
  new_password: string
  confirm_password: string
}
type tokenData = {
  token:string
  email:string
}

const ResetPassword : React.FC<tokenData> = ({token,email}) =>{
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors , isSubmitting },
    setError,
  } = useForm<ResetCustomerPasswordFormData>()

  const resetPassword = async (data: ResetCustomerPasswordFormData) => {
    console.log(data)
    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "validate",
        message: "Passwords do not match",
      })
      setErrorMessage("Passwords do not match")

      return
    }

    medusaClient.customers.resetPassword({
      email,
      password:data.confirm_password,
      token,
    })
    .then(({ customer }) => {
      console.log(customer.id)
    })

  }

  return <div>
     {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
  <form
      onSubmit={handleSubmit(resetPassword)}
      onReset={() => reset()}
      className="w-full"
    >
      
        <div className="grid grid-cols-2 gap-4">
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
        <Button>Restablecer</Button>
    </form>
  </div>
}

export default ResetPassword