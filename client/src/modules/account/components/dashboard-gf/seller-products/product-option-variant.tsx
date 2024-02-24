import React, { useEffect, useState } from "react"
import { Input, Spinner, Textarea, button } from "@nextui-org/react"
import { objetOptionVariant } from "./create-product"
import { includes } from "lodash"
import { Tooltip, Button } from "@nextui-org/react"
import { DotsSix, XCircleSolid, Trash } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

type props = {
  setOptionVariant: React.Dispatch<
    React.SetStateAction<Array<objetOptionVariant>>
  >
  objetOptionVariant: objetOptionVariant
}

const ProductOptionVariant: React.FC<props> = ({
  setOptionVariant,
  objetOptionVariant,
}) => {
  const [valueVariant, setValueVariant] = useState<string>()
  const [valueOption, setValueOption] = useState<string>()
  const handlerControlVariant = (e: any) => {
    if (e.includes(",")) {
      // setArrayValue((variant) =>
      //   variant.length ? [...variant, e.slice(0, -1)] : [e.slice(0, -1)]
      // )
      setOptionVariant((array) => {
        const newArray = array?.map((obj) => {
          if (obj.index === objetOptionVariant.index) {
            return {
              ...obj,
              titleValueVariant: obj.titleValueVariant?.length
                ? [...obj.titleValueVariant, e.slice(0, -1)]
                : [e.slice(0, -1)],
            }
          }
          return obj
        })
        return newArray
      })

      setValueVariant("")
    } else {
      setValueVariant(e)
    }
  }
  const handlerOptionControl = () => {
    setOptionVariant((array) => {
      const newArray = array?.map((obj) => {
        if (obj.index === objetOptionVariant.index) {
          return {
            ...obj,
            titleOption: valueOption,
          }
        }
        return obj
      })
      return newArray
    })
  }
  const handlerTrash = () => {
    setOptionVariant((array) => {
      const newArray = array.filter(
        (obj) => obj.index !== objetOptionVariant.index
      )

      return newArray
    })
  }
  const handlerTrashVariant = (valueVariant: string) => {
    if (!objetOptionVariant.titleValueVariant?.length) return
    setOptionVariant((array) => {
      const newArray = array.map((obj) => {
        if (obj.index === objetOptionVariant.index) {
          return {
            ...obj,
            titleValueVariant: obj.titleValueVariant?.filter(
              (v) => v !== valueVariant
            ),
          }
        }
        return obj
      })

      return newArray
    })
  }

  useEffect(() => {
    setValueOption(objetOptionVariant.titleOption || "")
  }, [objetOptionVariant])
  return (
    <div>
      <div className="flex gap-5 mb-5 items-end">
        <Input
          value={valueOption}
          size="sm"
          className="w-[200px]"
          label="Titulo opcion"
          placeholder="Color, tamaño"
          onChange={(e) => setValueOption(e.target.value)}
          onFocusChange={(e) => (!e ? handlerOptionControl() : "")}
        />
        <div>
          <Input
            labelPlacement="outside"
            label={`Preciona "Enter" o "," para agregar la variacion`}
            size="sm"
            placeholder="Color/tamaño/tiempo"
            value={valueVariant}
            onChange={(e) => handlerControlVariant(e.target.value)}
            startContent={
              objetOptionVariant.titleValueVariant ? (
                objetOptionVariant.titleValueVariant.map((v: string) => (
                  <button
                    className=" mx-1 px-2 py-1 rounded-[10px] bg-slate-300 w-auto "
                    onClick={() => handlerTrashVariant(v)}
                  >
                    <span className="flex gap-1 text-xs items-center">
                      {" "}
                      {v} <XCircleSolid />{" "}
                    </span>
                  </button>
                ))
              ) : (
                <></>
              )
            }
          />
        </div>
        <IconButton onClick={handlerTrash} className="text-red-700">
          <Trash />
        </IconButton>
      </div>
    </div>
  )
}

export default ProductOptionVariant
