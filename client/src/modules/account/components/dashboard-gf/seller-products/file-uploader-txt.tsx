// components/FileUploader.tsx
import InputFile from "@modules/common/components/input-file"
import { Button, Tooltip } from "@nextui-org/react"
import React, { useState, useEffect } from "react"

interface CodesResult {
  storeID?: string
  variantID: string
  codes: string[]
  quantity: number
  duplicates: { [key: string]: number } | number
}
interface CodesArray {
  variantID: string
  setAddResult: React.Dispatch<React.SetStateAction<CodesResult[]>>
}

const FileUploader: React.FC<CodesArray> = ({ variantID, setAddResult }) => {
  const [result, setResult] = useState<CodesResult | null>(null)
  const [filePlane, setFilePlane] = useState<File>()
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return setError("No se cargo el archivo")

    try {
      const text = await file.text()
      const codesArray = text
        .split("\n")
        .map((code) => code.trim())
        .filter((code) => code !== "")

      // Example validation: check if all codes match a pattern (e.g., alphanumeric)
      const isValid = codesArray.every((code) => /^[a-zA-Z0-9]+$/.test(code))

      if (!isValid) {
        throw new Error(
          "El formato de los códigos es incorrecto, por favor verifique e intente denuevo"
        )
      }

      const codesCount: { [key: string]: number } = {}
      codesArray.forEach((code) => {
        codesCount[code] = (codesCount[code] || 0) + 1
      })

      const duplicates = Object.fromEntries(
        Object.entries(codesCount).filter(([code, count]) => count > 1)
      )

      setResult({
        variantID,
        codes: codesArray,
        quantity: codesArray.length,

        duplicates,
      })

      setAddResult((old) => [
        ...old,
        {
          variantID,
          codes: codesArray,
          quantity: codesArray.length,

          duplicates: Object.keys(duplicates).length,
        },
      ])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Ocurrio un error")
      }
    }
  }
  useEffect(() => {
    if (!result) {
      setAddResult((old) =>
        old.filter((result) => result.variantID != variantID)
      )
    }
  }, [result])
  return (
    <div className="flex justify-center w-[250px] ">
      <div>
        <Tooltip
          className="mb-5 w-[350px]"
          content={
            <div className="px-1 py-2 ">
              <div className="  text-small font-bold">
                ¿ Qué Archivo a subir ?
              </div>
              <div className="text-tiny">
                Un archivo de texto que contiene claves de licencia, solo una
                clave separado por coma ",". Ejemplo: A1Bc2xxxxx, A1Bc2xxxxx,
                A1Bc2xxxxx, ...{" "}
              </div>
            </div>
          }
        >
          <b>
            <InputFile
              type="Plane"
              onChange={handleFileUpload}
              setResult={setResult}
              setFile={setFilePlane}
              file={filePlane}
              alt="Selecciona"
              label="Seleccionar Archivo .txt"
            />
          </b>
        </Tooltip>
        {result && (
          <div className=" text-xs ">
            <div>
              <span>{`Codigos: ${result.quantity} `}</span>
              {Object.keys(result.duplicates).length > 0 && (
                <>
                  <span>{`Duplicados: ${
                    Object.keys(result.duplicates).length
                  }`}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader
