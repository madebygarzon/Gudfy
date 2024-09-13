import { CheckoutFormValues } from "@lib/context/checkout-context"
import ConnectForm from "@modules/common/components/connect-form"
import Input from "@modules/common/components/input"
import CountrySelect from "../country-select"
import clsx from "clsx"
import { useForm, FieldValues } from "react-hook-form"
import { useMeCustomer } from "medusa-react"
import StepContainer from "../step-container"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { orderDataForm } from "@lib/context/order-context"

type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
type props = {
  setCompleteForm: Dispatch<SetStateAction<CompleteForm>>
  dataForm: orderDataForm
  setDataForm: (value: React.SetStateAction<orderDataForm>) => void
}

const CheckautVirtualForm: React.FC<props> = ({
  setCompleteForm,
  dataForm,
  setDataForm,
}) => {
  const { customer } = useMeCustomer()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<orderDataForm>()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target
    const value = e.target.value
    setDataForm((prevData) => {
      const newData = { ...prevData, [name]: value }
      const completed = handlerCompletedForm(newData)
      if (completed) setCompleteForm((com) => ({ ...com, form: true }))
      else setCompleteForm((com) => ({ ...com, form: false }))
      return newData
    })
  }

  const handlerCompletedForm = (object: orderDataForm) => {
    for (let clave in object) {
      if ((object as { [key: string]: string })[clave].trim() === "") {
        return false
      }
    }
    return true
  }
  useEffect(() => {
    setDataForm((prevData) => ({
      ...prevData,
      name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
    }))
  }, [customer])

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <div className="grid grid-cols-2 gap-x-2">
        <Input
          value={dataForm.name}
          label="Nombre"
          {...register("name", {
            required: "First name is required",
          })}
          errors={errors}
          onChange={handleInputChange}
        />

        <Input
          value={dataForm.last_name}
          label="Apellido"
          {...register("last_name", {
            required: "Last name is required",
          })}
          errors={errors}
          onChange={handleInputChange}
        />
      </div>
      <Input
        value={dataForm.email}
        label="Correo"
        {...register("email", {
          required: "email  is required",
        })}
        errors={errors}
        onChange={handleInputChange}
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Input
          value={dataForm.contry}
          label="Pais"
          {...register("contry", {
            required: "contry is required",
          })}
          autoComplete="country"
          errors={errors}
          onChange={handleInputChange}
        />

        <Input
          value={dataForm.city}
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
