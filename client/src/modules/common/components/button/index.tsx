import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ButtonProps = {
  isLoading?: boolean
  variant?: "primary" | "secondary"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({
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
        "px-10 py-[10px] rounded-[30] text-sm transition-colors duration-200 ",
        {
          "text-white bg-[#402e72] hover:bg-blue-gf":
            variant === "primary",
          "text-gray-900 bg-transparent border-gray-920 hover:bg-gray-100":
            variant === "secondary",
        },
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default Button
