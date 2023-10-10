import { ErrorMessage } from "@hookform/error-message"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"
import clsx from "clsx"
import React, { useEffect, useImperativeHandle, useState } from "react"
import { get } from "react-hook-form"

type TextareatProps = Omit<
  React.InputHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareatProps>(
  ({ type, name, label, errors, touched, required, ...props }, ref) => {
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const [current, setCurremt] = useState(false)
    const [value, setValur] = useState("")
    useImperativeHandle(ref, () => inputRef.current!)

    const hasError = get(errors, name) || get(touched, name)
    const handlreValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e.target.value)
    }
    return (
      <div>
        <div className="relative z-0 w-full text-base-regular">
          <textarea
            cols={1}
            rows={5}
            maxLength={200}
            name={name}
            onChange={(e) => handlreValue(e)}
            className={clsx(
              "pt-4 pb-1 block w-full px-4 mt-0 bg-transparent border-2 rounded-[30px] appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 border-gray-200",
              {
                "border-rose-500 focus:border-rose-500": hasError,
              }
            )}
            {...props}
            ref={inputRef}
            onFocus={() => {
              setCurremt(!current)
            }}
            onBlur={() => {
              setCurremt(!current)
            }}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className={clsx(
              "mx-3 px-1 transition-all absolute duration-300 top-0 -z-1 origin-0 text-gray-500 ",
              {
                "!text-rose-500": hasError,
              },
              { "text-[8px]": current || value }
            )}
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        </div>
        {hasError && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => {
              return (
                <div className="pt-1 pl-2 text-rose-500 text-xsmall-regular">
                  <span>{message}</span>
                </div>
              )
            }}
          />
        )}
      </div>
    )
  }
)

Textarea.displayName = "textarea"

export default Textarea
