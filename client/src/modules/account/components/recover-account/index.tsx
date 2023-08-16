import React, { useState } from "react"
import Input from "@modules/common/components/input"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { FieldValues, useForm } from "react-hook-form"
import { BsFacebook } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
}
interface stateProps {
  setIsRecovery: React.Dispatch<React.SetStateAction<boolean>>
}
const RecoverAccount: React.FC<stateProps> = ({ setIsRecovery }) => {
  const [authError, setAuthError] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInCredentials>()

  const onSubmit = async () => {}
  return (
    <div className="max-w-md w-full flex flex-col items-center">
      <h1 className="text-large-semi  mb-6 text-3xl">
        Restrablecer Contraseña
      </h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        ¿Nuevo usuario? <Link href={"./register"}>Crear una cuenta</Link>.
      </p>
      <form
        className="w-full font[400] shadow-xl border-2 rounded-3xl p-12 flex flex-col items-center "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nombre de usuario o correo electrónico"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              Estas credenciales no coinciden con nuestros registros
            </span>
          </div>
        )}
        <div className="flex w-full justify-between items-center">
          <Button className=" mt-6 rounded-full ">Restablecer</Button>
          <p
            className="w-[120px] mt-6 cursor-pointer hover:text-blue-800"
            onClick={() => setIsRecovery(false)}
          >
            Acceder
          </p>
        </div>
      </form>
      <p className="mt-5 font[900] text-xs">O ingresa con:</p>
      <div className="flex gap-4 pt-2">
        <BsFacebook className="p-[4px] bg-blue-500" color="white" size={35} />
        <FcGoogle
          className="p-[1px] border border-blue-500"
          color="white"
          size={35}
        />
      </div>
    </div>
  )
}

export default RecoverAccount
