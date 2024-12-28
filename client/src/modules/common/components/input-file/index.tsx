"use client"
import clsx from "clsx"

import Image from "next/image"
import { XMarkMini } from "@medusajs/icons"
import { GrDocumentPdf } from "react-icons/gr"
import { IconButton } from "@medusajs/ui"
import { useState } from "react"
import { Tooltip } from "@nextui-org/react"
import { CheckIcon } from "@lib/util/icons"

interface CodesResult {
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}
type InputProps = {
  type?: "Normal" | "Plane" | "Plane2"
  preview?: string
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  setResult?: React.Dispatch<React.SetStateAction<CodesResult | null>>
  file?: File
  alt: string
  label: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

const InputFile: React.FC<InputProps> = ({
  type = "Normal",
  setFile,
  setResult,
  label,
  alt,
  file,
  preview,
  onChange,
}) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(preview)
  if (type === "Plane2")
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className="transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 pl-2 pr-8 py-1.5 text-slate-700 hover:text-gray-100 border rounded-[5px] mb-5">
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="absolute top-[5%] right-[2px] text-white ml-5 hover:text-zinc-200"
                onClick={() => {
                  setFile(undefined)
                  if (setResult) setResult(null)
                }}
              >
                <XMarkMini className="bg-white  text-zinc-400" />
              </IconButton>

              <div className="font-medium"> Archivo cargado </div>
            </div>
            <Image
              alt={alt}
              src={file ? URL.createObjectURL(file) : `${previewImage}`}
              width={50}
              height={50}
              className="rounded w-[50px] h-[50Px]"
            />
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className="cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 border rounded-[5px] mb-5"
            >
              {" "}
              {label ?? "Seleccionar Archivo txt"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".txt"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0])
                }
                if (onChange) onChange(e)
              }}
            />
          </>
        )}
      </div>
    )
  else if (type === "Plane")
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className="transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 pl-2 pr-8 py-1.5 text-slate-700 hover:text-gray-100 border rounded-[5px] mb-5">
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="absolute top-[5%] right-[2px] text-white ml-5 hover:text-zinc-400"
                onClick={() => {
                  setFile(undefined)
                  if (setResult) setResult(null)
                }}
              >
                <XMarkMini className="bg-white  text-zinc-400" />
              </IconButton>

              <div className="font-medium"> Archivo cargado </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className="cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 border rounded-[5px] mb-5"
            >
              {" "}
              {label ?? "Seleccionar Archivo txt"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".txt"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0])
                }
                if (onChange) onChange(e)
              }}
            />
          </>
        )}
      </div>
    )
  else
    return (
      <div className="mt-4">
        {file || previewImage ? (
          <>
            <span className="text-xs text-center w-auto">{label}</span>
            <div className="flex">
              <div className="relative min-w-min">
                <IconButton
                  variant="transparent"
                  className="absolute top-1 right-1"
                  onClick={() => {
                    setFile(undefined)
                    setPreviewImage("")
                  }}
                >
                  <XMarkMini />
                </IconButton>
                {file?.type === "application/pdf" ||
                previewImage?.includes(".pdf") ? (
                  <GrDocumentPdf size={100} />
                ) : (
                  <Image
                    alt={alt}
                    src={file ? URL.createObjectURL(file) : `${previewImage}`}
                    width={200}
                    height={100}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className="cursor-pointer bg-zinc-400 text-white text-xs py-2 px-4 rounded-md"
            >
              {label ?? "Seleccionar Archivo"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".png, .webp, .jpg, .jpeg, .pdf"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
          </>
        )}
      </div>
    )
}

InputFile.displayName = "Input"

export default InputFile
