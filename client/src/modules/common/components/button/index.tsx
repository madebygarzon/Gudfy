import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"
import Link from "next/link"

type ButtonProps = {
  isLoading?: boolean
  variant?: "primary" | "secondary" | "selected"
  href?: string
  route?: string
  icon?: string
  disabled?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  href = "/",
  route,
  disabled = false,
  ...props
}: ButtonProps) => {
  const active = route === href
  if (variant === "selected") {
    return (
      <Link
        href={href}
        className={clsx(
          " flex  rounded-[5px] py-2 px-3 min-w-[160px] gap-x-2 items-center justify-center font-bold ",
          { "bg-white text-[#1F0054] ": !active },
          {
            "bg-[#9B48ED] text-white ": active,
          },
          className
        )}
      >
        {children}
      </Link>
    )
  }
  if (disabled)
    return (
      <button
        className={
          "text-white bg-[#61567e] rounded-[5px] px-10 py-[10px]  text-sm transition-colors duration-200 "
        }
        disabled={true}
      >
        {children}
      </button>
    )
  return (
    <button
      {...props}
      className={clsx(
        "px-10 py-[10px] rounded-[30] text-sm transition-colors duration-200 ",
        {
          "text-white bg-[#402e72] hover:bg-[#2c1f57] rounded-[5px]":
            variant === "primary" && !isLoading,
          "text-white bg-[#61567e] rounded-[5px]": disabled,
          "text-gray-900 bg-transparent border-gray-920 hover:bg-gray-100":
            variant === "secondary" && !isLoading,
          "opacity-50 cursor-not-allowed": isLoading,
        },
        className
      )}
      disabled={isLoading || disabled}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default Button
