import { CheckoutFormValues } from "@lib/context/checkout-context"
import ConnectForm from "@modules/common/components/connect-form"
import Input from "@modules/common/components/input"
import CountrySelect from "../country-select"
import clsx from "clsx"
import { useForm, FieldValues } from "react-hook-form"
import { useMeCustomer } from "medusa-react"
import StepContainer from "../step-container"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface CheckoutForm extends FieldValues {
  first_name: string
  last_name: string
  email: string
  country: string
  city: string
  phone: string
}
type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
type props = {
  setCompleteForm: Dispatch<SetStateAction<CompleteForm>>
}

const CheckautVirtualForm: React.FC<props> = ({ setCompleteForm }) => {
  const { customer } = useMeCustomer()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutForm>()

  const [checkoutData, setCheckoutData] = useState<CheckoutForm>({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    city: "",
    phone: "",
  })
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target
    const value = e.target.value
    setCheckoutData((prevData) => {
      const newData = { ...prevData, [name]: value }
      const completed = handlerCompletedForm(newData)
      if (completed) setCompleteForm((com) => ({ ...com, form: true }))
      else setCompleteForm((com) => ({ ...com, form: false }))
      return newData
    })
  }

  const handlerCompletedForm = (object: CheckoutForm) => {
    for (let clave in object) {
      if (object[clave].trim() === "") {
        return false
      }
    }
    return true
  }
  useEffect(() => {
    setCheckoutData((prevData) => ({
      ...prevData,
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
    }))
  }, [customer])

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <div className="grid grid-cols-2 gap-x-2">
        <Input
          value={checkoutData.first_name}
          label="Nombre"
          {...register("first_name", {
            required: "First name is required",
          })}
          errors={errors}
          onChange={handleInputChange}
        />

        <Input
          value={checkoutData.last_name}
          label="Apellido"
          {...register("last_name", {
            required: "Last name is required",
          })}
          errors={errors}
          onChange={handleInputChange}
        />
      </div>
      <Input
        value={checkoutData.email}
        label="Correo"
        {...register("email", {
          required: "email  is required",
        })}
        errors={errors}
        onChange={handleInputChange}
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Input
          label="Pais"
          {...register("country", {
            required: "Country is required",
          })}
          autoComplete="country"
          errors={errors}
          onChange={handleInputChange}
        />

        <Input
          label="Ciudad"
          {...register("city", {
            required: "City is required",
          })}
          autoComplete="address-level2"
          errors={errors}
          onChange={handleInputChange}
        />
      </div>
      <Input
        label="Telefono"
        {...register("phone")}
        autoComplete="tel"
        errors={errors}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default CheckautVirtualForm
