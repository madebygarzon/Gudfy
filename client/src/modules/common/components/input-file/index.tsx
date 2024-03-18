"use client"
import clsx from "clsx"
import React from "react"

type InputProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null | undefined>>
  label?: string
}

const InputFile: React.FC<InputProps> = ({ setFile, label }) => {
  return (
    <div className="mt-4">
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
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
      />
    </div>
  )
}

InputFile.displayName = "Input"

export default InputFile
