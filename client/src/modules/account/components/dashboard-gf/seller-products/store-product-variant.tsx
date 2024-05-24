"use client"
import Image from "next/image"
import React, { useState } from "react"
import { Input } from "@nextui-org/react"
import FileUploader from "./file-uploader-txt"
import Button from "@modules/common/components/button"
import { Button as ButtonM } from "@medusajs/ui"

type paramsProduct = {
  id: string
  variantID: string
  titleVariant: string
  thumbnail: string
  parentTitle: string
  desciption: string
  price: number
  amount: number
}
interface CodesResult {
  variantID: string
  codes: string[]
  amount: number
  duplicates: { [key: string]: number } | number
}

const StoreProductsVariant: React.FC<paramsProduct> = (product) => {
  const [dataProduct, setDataProduct] = useState<paramsProduct>(product)
  const [addResult, setAddResult] = useState<CodesResult[]>([])

  const handlerChangePrice = (e: number) => {
    setDataProduct({ ...dataProduct, price: e })
  }
  const handlerObjectComparation = (): boolean => {
    let compared = true
    for (const key in dataProduct) {
    }
    return compared
  }

  return (
    <div className=" flex w-full h-full">
      <div className="felx w-[50%] h-[100%] items-center justify-center">
        <Image
          alt={dataProduct.titleVariant}
          src={dataProduct.thumbnail}
          layout="fill"
          objectFit="contain"
          className=" w-[250px] h-[400px]"
        />
        <p className="w-[200px] h-auto">
          Descripción :{" "}
          {dataProduct.desciption ?? "Por ahora no tiene una descripción"}
        </p>
      </div>
      <div className="felx w-[50%] h-[100%] items-center justify-center pt-10">
        <div className="w-full h-[50%]">
          {}
          <Input
            label={"Precio"}
            type="number"
            onChange={(e) => {
              handlerChangePrice(parseFloat(e.target.value))
            }}
          />
          <FileUploader
            variantID={dataProduct.variantID}
            setAddResult={setAddResult}
          />
        </div>
        <div className="flex w-full h-[50%] justify-end items-end">
          <ButtonM variant="danger">Eliminar</ButtonM>
          <ButtonM variant="primary" disabled={handlerObjectComparation()}>
            Actualizar
          </ButtonM>
          <ButtonM variant="transparent"> {"<-"} Volver</ButtonM>
        </div>
      </div>
    </div>
  )
}

export default StoreProductsVariant
