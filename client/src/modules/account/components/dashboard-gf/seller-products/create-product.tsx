"use client"
import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react"
import Input from "@modules/common/components/input"
import Texarea from "@modules/common/components/textarea"
import InputFile from "@modules/common/components/input-file"
import { useForm } from "react-hook-form"
import { CreateProductInput } from "@modules/account/actions/post-seller-product"
import { Button as ButtonM } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import Image from "next/image"

type Reset = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateProduct({ setReset }: Reset) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [file, setFile] = useState<File | null>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  useEffect(() => {
    setFile(null)
  }, [isOpen])

  const onSubmit = handleSubmit(async (credentials) => {
    if (
      !credentials.title ||
      !credentials.subtitle ||
      !credentials.description ||
      !credentials.mid_code ||
      !credentials.material ||
      !file
    )
      return alert("Campos sin completar")

    CreateProductInput(
      {
        title: credentials.title,
        subtitle: credentials.subtitle,
        description: credentials.description,
        mid_code: credentials.mid_code,
        material: credentials.material,
      },
      transformImage(file)
    )
      .then(() => {
        onClose()
        setReset((boolean) => !boolean)
      })
      .catch(() => {
        alert("algo salio mal")
      })
  })

  const transformImage = (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    return formData
  }

  return (
    <>
      <div className=" flex-col w-full space-y-10">
        <div className="flex justify-center">
          <ButtonM
            variant="transparent"
            className=" border rounded-[5px]"
            onClick={onOpen}
          >
            Añadir producto
            <Plus />
          </ButtonM>
        </div>
      </div>
      {
        //Pop up Modal
      }
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Crear producto
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Titulo Producto"
                    {...register("title", {
                      required: "Inserta un titulo",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <Input
                    label="Subtitulo"
                    {...register("subtitle", {
                      required: "Inserta un subtitulo",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <Input
                    label="Slug"
                    {...register("mid_code", {
                      required: "Inserta el slug",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <Input
                    label="Material"
                    {...register("material", {
                      required: "Inserta el material",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <Texarea
                    label="Descripción"
                    {...register("description", {
                      required: "Inserta una descripción",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <InputFile setFile={setFile} />
                  {file ? (
                    <Image
                      alt="ImagePreview"
                      src={URL.createObjectURL(file)}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Image
                      alt="ImagePreview"
                      src="/product/image_default.svg"
                      width={100}
                      height={100}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" color="primary">
                    Enviar
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  )
}
