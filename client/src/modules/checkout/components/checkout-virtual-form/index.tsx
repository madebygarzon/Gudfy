import Input from "@modules/common/components/input"
import {
  FormState,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form"
import { useMeCustomer } from "medusa-react"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { orderDataForm } from "@lib/context/order-context"
import Country from "@modules/common/components/select_country/selectCountry"
import CustomSelectCountry from "@modules/common/components/select_country/customSelectCountry";

type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
type props = {
  propsForm: {
    register: UseFormRegister<orderDataForm>

    formState: FormState<orderDataForm>
  }
  setCompleteForm: Dispatch<SetStateAction<CompleteForm>>
  dataForm: orderDataForm
  setDataForm: (value: React.SetStateAction<orderDataForm>) => void
}

const CheckautVirtualForm: React.FC<props> = ({
  propsForm,
  setCompleteForm,
  dataForm,
  setDataForm,
}) => {
  const { customer } = useMeCustomer()
  const {
    register,
    formState: { errors },
  } = propsForm

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
  const handlerSelectCountry = (e: string) => {
    setDataForm((prevData) => {
      const newData = { ...prevData, contry: e }
      const completed = handlerCompletedForm(newData)
      if (completed) setCompleteForm((com) => ({ ...com, form: true }))
      else setCompleteForm((com) => ({ ...com, form: false }))
      return newData
    })
  }
  const [codeflag, setcodeFlag] = useState<number>(57)

  const handlerCompletedForm = (object: orderDataForm) => {
    Object.values(object).forEach((valor) => {
      if (valor === "") {
        return false
      }
    })

    return true
  }

  // Extract country code from phone number if available
  const extractCountryCode = (phone: string | undefined) => {
    if (!phone) return 57; // Default to Colombia (+57)
    const codeMatch = phone.match(/\(\+(\d+)\)/);
    return codeMatch ? parseInt(codeMatch[1]) : 57;
  }

  useEffect(() => {
    console.log("customer", customer)
    
    // Extract country code from phone if available
    if (customer?.phone) {
      const extractedCode = extractCountryCode(customer.phone);
      setcodeFlag(extractedCode);
    }
    
    setDataForm((prevData) => ({
      ...prevData,
      name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      contry: "Colombia",
    }))
  }, [customer])

  return (
    <form className="grid grid-cols-1 gap-y-2">
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
        <CustomSelectCountry
          initialCode={codeflag}
          setCodeFlag={setcodeFlag}
          setSelectCountry={handlerSelectCountry}
        />
        <Input
          value={dataForm.city}
          label="Ciudad"
          {...register("city", {
            required: "Escoge un ciudad",
          })}
          errors={errors}
          onChange={handleInputChange}
        />
      </div>

      <Input
        type="number"
        contentStar={`(+${codeflag})`}
        label="Telefono"
        {...register("phone")}
        errors={errors}
        required={false}
      />

      {/* <Input
        label="Telefono"
        {...register("phone")}
        autoComplete="tel"
        errors={errors}
        onChange={handleInputChange}
      /> */}
    </form>
  )
}

export default CheckautVirtualForm
