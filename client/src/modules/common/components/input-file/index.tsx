"use client"
import Image from "next/image"
import { XMarkMini } from "@medusajs/icons"
import { GrDocumentPdf } from "react-icons/gr"
import { IconButton } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { CheckIcon, AddIcon } from "@lib/util/icons"
interface CodesResult {
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}
type InputProps = {
  type?: "Normal" | "Plane" | "Plane2" | "Image"
  preview?: string
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  setResult?: React.Dispatch<React.SetStateAction<CodesResult | null>>
  file?: File
  alt: string
  label: string
  accept?: string
  maxSize?: number
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
  accept = "*/*",
  maxSize = 1 * 1024 * 1024,
  onChange,
}) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(preview)
  const [error, setError] = useState<string | null>(null)

  const sharedStyles =
    "cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 rounded-[5px] mb-5"

  const sharedStylesInt =
    "absolute top-[5%] right-[2px] text-white ml-5 hover:text-zinc-200"

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  useEffect(() => {
    if (!file && previewImage) {
      setPreviewImage(undefined)
    }
  }, [file, previewImage])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      setError(
        `¡El archivo supera el tamaño máximo permitido de ${
          maxSize / (1024 * 1024)
        } MB!`
      )
      return
    }

    if (accept && !selectedFile.type.match(accept.replace("*", ".*"))) {
      setError("¡El tipo de archivo seleccionado no es válido!")
      return
    }

    setFile(selectedFile)
    setPreviewImage(URL.createObjectURL(selectedFile))
    if (onChange) await onChange(e)
  }

  const handleRemoveFile = () => {
    setFile(undefined)
    setPreviewImage(undefined)
    if (setResult) setResult(null)
  }

  if (type === "Plane2")
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className={`${sharedStyles}`}>
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className={`${sharedStylesInt}`}
                onClick={() => {
                  setFile(undefined)
                  if (setResult) setResult(null)
                }}
              >
                <XMarkMini className="bg-white  text-zinc-400" />
              </IconButton>

              <div className="font-medium"> Archivo cargado</div>
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
              className="cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 rounded-[5px] mb-5"
            >
              <AddIcon className="w-5" /> {label ?? "Seleccionar archivo txt"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".txt"
              onChange={handleFileChange}
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
            <div className={`${sharedStyles}`}>
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className={`${sharedStylesInt}`}
                onClick={() => {
                  setFile(undefined)
                  if (setResult) setResult(null)
                }}
              >
                <XMarkMini className="bg-white  text-zinc-400" />
              </IconButton>

              <div className="font-medium mr-4">Archivo cargado</div>
            </div>
            {/* <Image
              alt={alt}
              src={file ? URL.createObjectURL(file) : `${previewImage}`}
              width={50}
              height={50}
              className="rounded w-[50px] h-[50Px]"
            /> */}
          </>
        ) : (
          <>
            <label
              htmlFor={label}
              className="cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 shadow-lg rounded-[5px] mb-5"
            >
              <AddIcon className="w-5" /> {label ?? "Seleccionar Archivo txt"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".txt"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    )
  else if (type === "Image")
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className="transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 pl-2 pr-8 py-1.5 text-slate-700 hover:text-gray-100  rounded-[5px] mb-5">
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="absolute top-[5%] right-[2px] text-white ml-5 hover:text-zinc-400"
                onClick={() => {
                  setFile(undefined)
                  setPreviewImage(undefined)
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
              className="cursor-pointer transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] after:hidden bg-ui-button-transparent hover:bg-ui-button-transparent-hover active:bg-ui-button-transparent-pressed focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base disabled:!bg-transparent disabled:!shadow-none txt-compact-small-plus gap-x-1.5 px-3 py-1.5 text-slate-700 hover:text-gray-100 shadow-lg rounded-[5px] mb-5"
            >
              <AddIcon className="w-5" /> {label ?? "Seleccionar Archivo txt"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept=".jpg, .jpeg, .png, .webp"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    )
  else
    return (
      <div className="">
        {file || previewImage ? (
          <>
            <div className={`${sharedStyles}`}>
              <CheckIcon />
              <IconButton
                size="2xsmall"
                variant="transparent"
                className={sharedStylesInt}
                onClick={handleRemoveFile}
              >
                <XMarkMini className="bg-white  text-zinc-400" />
              </IconButton>

              <div className="font-medium mr-4">Imagen cargada</div>
            </div>

            {previewImage && (
              <div className="mt-[-10px]">
                <Image
                  alt={alt}
                  src={previewImage}
                  width={100}
                  height={100}
                  className="rounded w-[100px] h-[100px]"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <label htmlFor={label} className={sharedStyles}>
              <AddIcon className="w-5" />
              {label ?? "Seleccionar archivo"}
            </label>
            <input
              type="file"
              id={label}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </>
        )}
        {error && (
          <div className="-mt-2 text-red-500 text-sm text-center font-bold">
            {error}
          </div>
        )}
      </div>
    )
}

InputFile.displayName = "Input"

export default InputFile
