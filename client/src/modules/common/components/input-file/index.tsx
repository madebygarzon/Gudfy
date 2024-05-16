"use client"
import clsx from "clsx"

import Image from "next/image"
import { XMarkMini } from "@medusajs/icons"
import { GrDocumentPdf } from "react-icons/gr"
import { IconButton } from "@medusajs/ui"
import { useState } from "react"
import { Tooltip } from "@nextui-org/react"

interface CodesResult {
  codes: string[]
  amount: number
  duplicates: { [key: string]: number }
}
type InputProps = {
  type?: "Normal" | "Plane"
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
  if (type === "Plane")
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className=" relative flex min-w-min bg-zinc-400 text-white text-sm py-2 px-4 rounded-md">
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="absolute top-[25%] right-2 text-white hover:text-zinc-400"
                onClick={() => {
                  setFile(undefined)
                  if (setResult) setResult(null)
                }}
              >
                <XMarkMini />
              </IconButton>
              <div className="font-medium"> Archivo Cargado </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className="cursor-pointer bg-zinc-400 text-white text-xs py-2 px-4 rounded-md hover:bg-zinc-500"
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
