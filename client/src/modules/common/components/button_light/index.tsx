import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ButtonProps = {
  isLoading?: boolean
  variant?: "primary" | "secondary"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const ButtonLigth = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        " flex items-center justify-center h-[40px] px-[25px] py-[10px] rounded transition-colors duration-200 disabled:opacity-50",
        {
          "border-[1px] border-white border-solid": variant === "primary",
          "border-[1px] border-blue-gf border-solid": variant === "secondary",
        },
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default ButtonLigth
