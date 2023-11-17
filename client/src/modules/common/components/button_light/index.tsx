import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ButtonProps = {
  isLoading?: boolean
  variant?: "primary" | "secondary" | "tertiary"
  name?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ButtonLigth = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  name,
  ...props
}: ButtonProps) => {
  return (
    <button
      name={name}
      {...props}
      className={clsx(
        " flex items-center justify-center h-[48px] text-[14px]  px-12 py-[10px] rounded transition-colors duration-200 disabled:opacity-50",
        {
          "border-[1px] border-blue-gf border-solid font-light":
            variant === "primary",
          "border-[1px] border-white border-solid text-white":
            variant === "secondary",
          "border-[1px] border-[#9B48ED] border-solid": variant === "tertiary",
        },
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default ButtonLigth
