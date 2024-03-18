import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Autocomplete, AutocompleteItem } from "@nextui-org/react"
//import Input from "@modules/common/components/input"
import { Input } from "@nextui-org/react"
import Image from "next/image"
import { FieldValues, useForm } from "react-hook-form"
import { actionCreateSellerApplication } from "@modules/account/actions/action-seller-application"
import InputFile from "@modules/common/components/input-file"

interface Proveedor {
  value: string
  label: string
}

interface SellerCredentials extends FieldValues {
  name: string
  last_name: string
  email: string
  phone: string
  contry: string
  city: string
  address: string
  postal_code: string
  supplier_name: string
  supplier_type: string
  company_name: string
  company_country: string
  company_city: string
  company_address: string
  // supplier_documents: File | null
  quantity_products_sale: string
  example_product: string
  quantity_per_product: string
  current_stock_distribution: string
  // front_identity_document: File | null
  // subsequent_identity_document: File | null
  // address_proof: File | null
  // campo1_metodo_pago: string
  // campo2_metodo_pago: string
}

const SellerRequestPerson = () => {
  const [formData, setFormData] = useState<SellerCredentials>({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    contry: "",
    city: "",
    address: "",
    postal_code: "",
    supplier_name: "",
    supplier_type: "",
    company_name: "",
    company_country: "",
    company_city: "",
    company_address: "",
    // supplier_documents: null,
    quantity_products_sale: "",
    example_product: "",
    quantity_per_product: "",
    current_stock_distribution: "",
    // front_identity_document: null,
    // reverse_identity_document: null,
    // address_proof: null,
    // campo1_metodo_pago: "",
    // campo2_metodo_pago: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target

    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
      }
    } else {
      const value = e.target.value
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  }

  const tipo_proveedor: Proveedor[] = [
    { value: "gamedeveloper", label: "GameDeveloper" },
    { value: "distribuidor", label: "Distribuidor" },
    { value: "revendedor", label: "Revendedor" },
  ]

  const cuantos_productos: Proveedor[] = [
    { value: "de1a20", label: "Entre 1 y 20" },
    { value: "de20a100", label: "Entre 20 y 100" },
    { value: "de100a500", label: "Entre 100 y 500" },
    { value: "masde500", label: "Más de 500" },
  ]

  const elementos_por_producto: Proveedor[] = [
    { value: "de1a20", label: "Entre 1 y 20" },
    { value: "de20a100", label: "Entre 20 y 100" },
    { value: "de100a500", label: "Entre 100 y 500" },
    { value: "masde500", label: "Más de 500" },
  ]

  const [fileFrontDocument, setFileFrontDocumet] = useState<File | null>()
  const [fileRevertDocument, setFileRevertDocument] = useState<File | null>()
  const [fileAddressProod, setFileAddressProod] = useState<File | null>()

  const onSubmit = handleSubmit(async () => {
    //Enviar solicitud después de completar todos los pasos
    if (!fileFrontDocument || !fileRevertDocument || !fileAddressProod) return

    actionCreateSellerApplication(
      formData,
      fileFrontDocument,
      fileRevertDocument,
      fileAddressProod
    ).then((e) => {
      //handlerReset()
    })
  })
  const handleAutocompletChange = (value: string, name: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }
  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
        <p className="text-xl font-extrabold  text-center">
          Información Básica
        </p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos personales
        </p>
        <Input
          label="Nombre"
          {...register("name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          //errorMessage=""
          onChange={handleInputChange}
        />

        <Input
          label="Apellidos"
          {...register("last_name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Correo electrónico"
          {...register("email", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Numero telefónico"
          {...register("phone", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="text-xl font-extrabold  text-center">
          Información Comercial
        </p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos generales
        </p>
        <Input
          label="País"
          {...register("contry", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad"
          {...register("city", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección"
          {...register("address", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Código postal"
          {...register("postal_code", {
            required: "Campo requerido",
          })}
          autoComplete="number"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="text-xl font-extrabold  text-center">Orígen del stock</p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos del proveedor
        </p>
        <Input
          label="Nombre del proveedor"
          {...register("supplier_name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />

        <Autocomplete
          //variant={variant}
          defaultItems={tipo_proveedor}
          label="Tipo de proveedor"
          {...register("supplier_type", {
            required: "Campo requerido",
          })}
          className="max-w"
          onInputChange={(e) => handleAutocompletChange(e, "supplier_type")}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          label="Nombre de empresa proveedora"
          {...register("company_name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="País de la empresa proveedora"
          {...register("company_country", {
            required: "Campo requerido",
          })}
          autoComplete="number"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad del proveedor"
          {...register("company_city", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección del proveedor"
          {...register("company_address", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="text-xl font-extrabold  text-center">Orígen del stock</p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos del proveedor
        </p>
        <Input
          //type="file"
          label="Sube documentos de proveedor"
          {...register("supplier_documents", {
            required: "Campo requerido",
            // validate: {
            //   required: (file) => file.length > 0 || "Sube un documento",
            // },
          })}
          autoComplete="on"
          onChange={handleInputChange}
        />

        <p className="font-semibold text-gray-800 text-sm text-center">
          ¿Que venderas?
        </p>

        <Autocomplete
          //variant={variant}
          defaultItems={cuantos_productos}
          label="¿Cuántos productos venderás?"
          {...register("quantity_products_sale", {
            required: "Campo requerido",
          })}
          className="max-w"
          onInputChange={(e) =>
            handleAutocompletChange(e, "quantity_products_sale")
          }
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Dános ejemplos de productos que venderas
        </p>

        <Input
          label="Ejemplos"
          {...register("example_product", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />

        <Autocomplete
          //variant={variant}
          defaultItems={elementos_por_producto}
          label="Cantidad de productos de elementos por producto"
          {...register("quantity_per_product", {
            required: "Campo requerido",
          })}
          className="max-w"
          onInputChange={(e) =>
            handleAutocompletChange(e, "quantity_per_product")
          }
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <p className="font-semibold text-gray-800 text-sm text-center">
          ¿Donde distribuyes actualmente tu stock? Si es posible, proporciona
          enlaces a tus perfiles en otras plataformas.
        </p>
        <Input
          label="Ejemplos "
          {...register("current_stock_distribution", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="font-semibold text-gray-800 text-sm text-center">
          Verificación comercial
        </p>
        {fileFrontDocument && (
          <Image
            alt="fileFrontDocument "
            src={URL.createObjectURL(fileFrontDocument)}
            width={100}
            height={100}
          />
        )}
        <InputFile
          label="Documento de identidad parte frontal "
          //errors={errors}
          setFile={setFileFrontDocumet}
        />
        {fileRevertDocument && (
          <Image
            alt="fileRevertDocument"
            src={URL.createObjectURL(fileRevertDocument)}
            width={100}
            height={100}
          />
        )}
        <InputFile
          label="Documento de identidad parte posterior "
          //errors={errors}
          setFile={setFileRevertDocument}
        />
        {fileAddressProod && (
          <Image
            alt="FileAddressProod"
            src={URL.createObjectURL(fileAddressProod)}
            width={100}
            height={100}
          />
        )}
        <InputFile
          label="Comprobante de domicilio "
          //errors={errors}
          setFile={setFileAddressProod}
        />
        <p className="font-semibold text-gray-800 text-sm text-center">
          Métodos de pago
        </p>
        <Input
          label="Campo 1 "
          {...register("campo1_metodo_pago", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Campo 2 "
          {...register("campo2_metodo_pago", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />

        <ButtonMedusa
          className="mt-4 mb-4 rounded-[5px]"
          type="submit"
          color="primary"
        >
          Enviar solicitud
        </ButtonMedusa>

        {/* <ButtonMedusa className="rounded-[5px]" type="submit" onClick={nextStep} color="primary">
          {step === 3 ? "Enviar solicitud" : "Siguiente"}
        </ButtonMedusa> */}

        {/* <ButtonMedusa
            className="rounded-[5px]"
            type={step !== 3 ? "submit" : undefined}
            onClick={step === 3 ? nextStep : undefined}
            color="primary"
          >
            {step === 3 ? "Enviar solicitud" : "Siguiente"}
          </ButtonMedusa> */}
      </div>
    </form>
  )
}

export default SellerRequestPerson
