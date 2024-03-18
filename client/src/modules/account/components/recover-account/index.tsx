import React, { useState } from "react"
import { medusaClient } from "@lib/config"
import Input from "@modules/common/components/input"
import Button from "@modules/common/components/button"
import { useForm } from "react-hook-form"
import { BsFacebook } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import ButtonLigth from "@modules/common/components/button_light"
import { BsFillArrowLeftCircleFill } from "react-icons/bs"

type FormValues = {
  email: string
}

interface stateProps {
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>
}
const RecoverAccount: React.FC<stateProps> = ({ setIsRecovery }) => {
  const [mailSent, setSentMail] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>()

  const onSubmit = handleSubmit(async (values: FormValues) => {
    const validRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!validRegExp.test(values.email))
      return setError("email", {
        type: "validate",
        message: "Ingrese un correo valido",
      })
    await medusaClient.auth.exists(values.email).then(async (e) => {
      if (e.exists) {
        medusaClient.customers
          .generatePasswordToken({
            email: values.email,
          })
          .then((e) => {
            console.log(e)
            setSentMail(true)
          })
          .catch((e) => {
            alert("error enviado")
            console.log(e)
          })
      } else {
        setError("email", {
          type: "validate",
          message: "Este correo no esta registrado en nuestro sistema",
        })
      }
    })
  })

  return (
    <div className="max-w-md w-full flex flex-col items-center">
      <h1 className="text-large-semi  mb-6 text-3xl">
        Restrablecer Contraseña
      </h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        ¿Nuevo usuario? <Link href={"./register"}>Crear una cuenta</Link>.
      </p>
      {!mailSent ? (
        <form
          className="w-full font[400] shadow-xl rounded-3xl p-12 flex flex-col items-center "
          onSubmit={onSubmit}
        >
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="Nombre de usuario o correo electrónico"
              {...register("email", { required: "Este campo es requerido" })}
              autoComplete="email"
              errors={errors}
            />
          </div>
          <div className="flex w-full justify-between items-center mt-6">
            <Button className="  rounded-[5px] ">Restablecer</Button>
            <ButtonLigth
              className="gap-x-2 text-blue-gf border-blue-gf "
              onClick={() => setIsRecovery(false)}
            >
              <BsFillArrowLeftCircleFill color="#1F0046" />
              Volver
            </ButtonLigth>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center ">
          <span className="text-center text-[20px]">
            Revisa tu email, te enviamos un correo de restablecimiento
          </span>
          <div className="pt-10 ">
            <ButtonLigth
              className="gap-x-2 text-blue-gf border-blue-gf "
              onClick={() => setIsRecovery(false)}
            >
              <BsFillArrowLeftCircleFill color="#1F0046" />
              Volver
            </ButtonLigth>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecoverAccount
