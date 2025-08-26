"use client"

import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import NumberCountry from "@modules/common/components/select_country/selectNumberCountry"
import { Textarea } from "@heroui/react"
import axios from "axios"

interface ContactFormValues extends FieldValues {
  name: string
  email: string
  phone?: string
  message: string
}

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeFlag, setCodeFlag] = useState<number>(57) // Código de país por defecto (Colombia)
  const [submitError, setSubmitError] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ContactFormValues>()

  const handleErrors = (values: ContactFormValues) => {
    let isValid = true
    const validations: Record<keyof ContactFormValues, RegExp> = {
      name: /^[a-zA-Z\s]+$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phone: /^[0-9]+$/,
      message: /^[\s\S]{10,}$/, // Mínimo 10 caracteres
    }

    for (const field in validations) {
      if (values[field]) {
        if (!validations[field].test(values[field])) {
          isValid = false
          switch (field) {
            case "name":
              setError("name", {
                type: "validate",
                message: "Solo se aceptan caracteres alfabéticos",
              })
              break
            case "email":
              setError("email", {
                type: "validate",
                message: "Correo no válido",
              })
              break
            case "phone":
              setError("phone", {
                type: "validate",
                message: "Número no válido",
              })
              break
            case "message":
              setError("message", {
                type: "validate",
                message: "El mensaje debe tener al menos 10 caracteres",
              })
              break
            default:
              true
          }
        }
      } else if (field !== "phone") {
        isValid = false
      }
    }
    return isValid
  }

  const onSubmit = handleSubmit(async (values) => {
    const isValid = handleErrors(values)
    if (!isValid) return

    setIsSubmitting(true)
    setSubmitError(undefined)

    try {
      // Simulación de envío de formulario
      if (values.phone) {
        values = {
          ...values,
          phone: `(+${codeFlag}) ${values.phone}`,
        }
      }

      postSendContactForm(values).then(() => {
        alert("Formulario enviado correctamente")
        setIsSubmitting(false)
      })
    } catch (error) {
      setIsSubmitting(false)
      setSubmitError("Algo salió mal al enviar el formulario")
    }
  })

  return (
    <div className="flex flex-col items-center justify-start my-10 mx-4 sm:mx-80">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h2 className="text-2xl mt-2 font-bold text-blue-gf capitalize mb-4">
        ¡Hablemos!
      </h2>
      <p className="text-gray-700 text-center">
        ¿Tienes alguna consulta, sugerencia o propuesta para mejorar tu
        experiencia en GudfyP2P? Deja tu mensaje y uno de nuestros especialistas
        se pondrá en contacto contigo lo antes posible. ¡Juntos podemos hacer
        crecer nuestra comunidad de comercio digital! 😊
      </p>
      <form
        className="w-full font[400] shadow-xl rounded-3xl p-10 flex flex-col items-center"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre"
            {...register("name", { required: "Nombre requerido" })}
            autoComplete="name"
            errors={errors}
          />
          <Input
            label="Correo"
            {...register("email", { required: "Correo requerido" })}
            autoComplete="email"
            errors={errors}
          />
          <div className="flex items-center">
            <div className="w-[25%]">
              <NumberCountry setCodeFlag={setCodeFlag} />
            </div>
            <div className="w-[75%]">
              <Input
                contentStar={`(+${codeFlag})`}
                label="Teléfono"
                {...register("phone")}
                autoComplete="phone"
                errors={errors}
                required={false}
              />
            </div>
          </div>
          <Textarea
            label="Mensaje"
            {...register("message", { required: "Mensaje requerido" })}
            autoComplete="off"
          />
        </div>
        {submitError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              {submitError}
            </span>
          </div>
        )}
        <Button type="submit" className="mt-5 rounded-[5px]">
          Enviar
        </Button>
      </form>
      <p className="text-gray-700 text-center mt-5">
        Deja tu mensaje y uno de nuestros especialistas se pondrá en contacto
        contigo lo antes posible. ¡Juntos podemos hacer crecer nuestra comunidad
        de comercio digital! 😊
      </p>
    </div>
  )
}
export default Contact

const postSendContactForm = async (data: ContactFormValues) => {
  const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "9000"
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    `http://localhost:${BACKEND_PORT}`
  try {
    const postSendContactForm = await axios.post(
      `${BACKEND_URL}/store/contact`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {}
}
