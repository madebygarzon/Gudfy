"use client"
import clsx from "clsx"

import Image from "next/image"
import { XMarkMini } from "@medusajs/icons"
import { GrDocumentPdf } from "react-icons/gr"
import { IconButton } from "@medusajs/ui"
import { useState } from "react"

type InputProps = {
  preview?: string
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  file?: File
  alt: string
  label?: string
}

const InputFile: React.FC<InputProps> = ({
  setFile,
  label,
  alt,
  file,
  preview,
}) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(preview)
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
