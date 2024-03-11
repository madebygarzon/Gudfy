import React from "react"
import { variant, objetOptionVariant } from "./create-product"
import { Select as SelectNext, SelectItem } from "@nextui-org/react"
import { Input, Spinner } from "@nextui-org/react"
import { DotsSix } from "@medusajs/icons"

type variantType = {
  variant: variant
  optionVariant: Array<objetOptionVariant>
}

const ProductVariat: React.FC<variantType> = ({ variant, optionVariant }) => {
  const handlerOptionVariantControl = (
    index: number,
    titleOption: string,
    titleValueVariant: string
  ) => {
    if (Array.isArray(variant.typeOpcionVariant)) {
      variant.typeOpcionVariant[index] = {
        titleOption,
        titleValueVariant,
      }
    }
  }

  return (
    <div className="ml-5">
      <div className=" flex my-5 items-center   gap-2">
        <DotsSix />
        {optionVariant.map((obj, i) => (
          <div key={obj.titleOption} className="flex ">
            <SelectNext
              label={obj.titleOption || "vacio"}
              placeholder="Seleccione la variacion"
              className="w-[180px]"
              onChange={(e) => {
                handlerOptionVariantControl(
                  i,
                  obj.titleOption || "",
                  e.target.value
                )
              }}
            >
              {obj.titleValueVariant?.length ? (
                obj.titleValueVariant?.map((objV) => (
                  <SelectItem key={objV} textValue={objV}>
                    {objV}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={i}>
                  <Spinner />
                </SelectItem>
              )}
            </SelectNext>
          </div>
        ))}

        <Input
          className="max-w-[250px]"
          size="sm"
          type="number"
          label="Precio"
          //   value={`${variant.prices}`}
          placeholder="0.00"
          onChange={(e) => {
            variant.prices = parseFloat(e.target.value.replace(",", "."))
            // setValueVariant({
            //   ...valueVariant,
            //   prices: parseFloat(e.target.value.replace(",", ".")),
            // })
          }}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <Input
          className="max-w-[250px]"
          size="sm"
          type="number"
          label="Cantidad"
          placeholder="10"
          //   value={`${variant.inventory_quantity}`}
          onChange={(e) => {
            variant.inventory_quantity = parseInt(e.target.value)
            // setValueVariant({
            //   ...valueVariant,
            //   inventory_quantity: parseInt(e.target.value),
            // })
          }}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Unidades</span>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default ProductVariat
