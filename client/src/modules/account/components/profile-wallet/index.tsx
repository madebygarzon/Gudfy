import { Customer } from "@medusajs/medusa"
import Input from "@modules/common/components/input"
import { useUpdateMe } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import AccountInfo from "../account-info"
import { updateWallet } from "../../actions/wallet/update-wallet"
import { useAccount } from "@lib/context/account-context"

export type dataWallet = {
  id: string
  store_id: string
  available_balance: number
  outstanding_balance: number
  balance_paid: number
  wallet_address: string
  payment_request: boolean
}

type ProfileWalletProps = {
  wallet: dataWallet
  customer: Omit<Customer, "password_hash">
  onWalletUpdate?: () => void
}

type UpdateWalletAddressFormData = {
  wallet_address: string
  confirm_wallet_address: string
}

const ProfileWallet: React.FC<ProfileWalletProps> = ({
  wallet,
  customer,
  onWalletUpdate,
}) => {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const { refetchCustomer } = useAccount()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
  } = useForm<UpdateWalletAddressFormData>()

  const clearState = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage(undefined)
  }

  useEffect(() => {
    if (wallet?.wallet_address) {
      setValue("wallet_address", "")
      setValue("confirm_wallet_address", "")
    }
    setErrorMessage(undefined)
  }, [wallet, setValue])

  const updateWalletAddress = async (data: UpdateWalletAddressFormData) => {
    clearState()
    setErrorMessage(undefined)

    if (data.wallet_address !== data.confirm_wallet_address) {
      setError("confirm_wallet_address", {
        type: "validate",
        message: "Las direcciones de wallet no coinciden",
      })
      setErrorMessage("Las direcciones de wallet no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const result = await updateWallet(data.wallet_address)

      if (result) {
        setIsSuccess(true)
        refetchCustomer()

        if (onWalletUpdate) {
          onWalletUpdate()
        }
      } else {
        setIsError(true)
        setErrorMessage("Error al actualizar la dirección de wallet")
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(updateWalletAddress)}
      onReset={() => reset()}
      className="w-full"
    >
      <AccountInfo
        label="Dirección de Wallet"
        currentInfo={
          wallet?.wallet_address ? (
            <span className="font-medium break-all">
              {wallet.wallet_address}
            </span>
          ) : (
            <span className="text-gray-500 italic">No configurada</span>
          )
        }
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Nueva dirección de wallet"
            {...register("wallet_address", {
              required: "Este campo es obligatorio",
            })}
            errors={errors}
          />
          <Input
            label="Confirmar dirección de wallet"
            {...register("confirm_wallet_address", {
              required: "Este campo es obligatorio",
            })}
            errors={errors}
          />
          <p className="text-xs text-gray-500 mt-1">
            Asegúrate de ingresar correctamente la dirección de tu wallet. Las
            transacciones a direcciones incorrectas no pueden ser revertidas.
          </p>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileWallet
