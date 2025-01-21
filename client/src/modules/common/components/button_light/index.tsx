import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React from "react"

type ButtonProps = {
  isLoading?: boolean
  variant?: "primary" | "secondary" | "tertiary"
  name?: string
  href?: string 
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> 

const ButtonLigth = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  name,
  href,
  ...props
}: ButtonProps) => {
  const commonClasses = clsx(
    "flex items-center justify-center h-[48px] text-[14px] px-12 py-[10px] rounded transition-colors duration-200 disabled:opacity-50",
    {
      "border-[1px] border-blue-gf border-solid font-light": variant === "primary",
      "border-[1px] border-white border-solid text-white": variant === "secondary",
      "border-[1px] border-[#9B48ED] border-solid": variant === "tertiary",
    },
    className
  )

  if (href) {
    return (
      <a href={href} className={clsx(commonClasses, "inline-block")} {...props}>
        {isLoading ? <Spinner /> : children}
      </a>
    )
  }

  return (
    <button
      name={name}
      {...props}
      className={commonClasses}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}

export default ButtonLigth
