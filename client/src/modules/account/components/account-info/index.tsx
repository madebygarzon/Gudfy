import { Disclosure } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import Button from "@modules/common/components/button"
import clsx from "clsx"
import { useEffect } from "react"
import ButtonLigth from "@modules/common/components/button_light"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
}

const AccountInfo = ({
  label,
  currentInfo,
  isLoading,
  isSuccess,
  isError,
  clearState,
  errorMessage = "Ha ocurrido un error, inténtalo de nuevo",
  children,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-small-regular">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <span className="text-gray-500 font-bold text-base">{label}</span>
          <div className="flex items-center flex-1 justify-start sm:justify-end gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="text-left">{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <ButtonLigth
          variant="secondary"
          className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none min-w-56"
          onClick={handleToggle}
          type={state ? "reset" : "button"}
        >
          {state ? "Cancelar 🚫" : "Editar ✏️"}
        </ButtonLigth>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
        >
          <div className="bg-green-100 text-green-500 p-4 my-4">
            <span className="text-sm">¡{label} actualizado con éxito!</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
        >
          <div className="bg-rose-100 text-rose-500 p-4 mt-4">
            <span className="text-sm">{errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 mt-4">
              <ButtonLigth
                isLoading={isLoading}
                className="bg-[#28A745] hover:bg-[#218838] text-white border-none w-full sm:w-auto"
                type="submit"
              >
                Guardar cambios
              </ButtonLigth>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
