import React, { useState, useEffect } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Autocomplete, AutocompleteItem } from "@heroui/react"
//import Input from "@modules/common/components/input"
import { Input } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import { FieldValues, useForm } from "react-hook-form"
import { actionUpdateSellerApplication } from "@modules/account/actions/action-seller-application"
import InputFile from "@modules/common/components/input-file"
import { XCircleSolid } from "@medusajs/icons"
import type { SellerCredentials as SellerCredentialsGlobal } from "types/global"

interface Proveedor {
  value: string
  label: string
}
type SellerCredentials = SellerCredentialsGlobal & {
  id: string
}
type props = {
  data?: SellerCredentials
  onClose: () => void
  handlerReset: () => void
}

const SellerUpdateRequest = ({ onClose, handlerReset, data }: props) => {
  const [formData, setFormData] = useState<SellerCredentials>({
    id: "",
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
    supplier_documents: "",
    quantity_products_sale: "",
    example_product: "",
    quantity_per_product: "",
    current_stock_distribution: "",
    front_identity_document: "",
    revers_identity_document: "",
    address_proof: "",
    field_payment_method_1: "",
    field_payment_method_2: "",
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
    { value: "GameDeveloper", label: "GameDeveloper" },
    { value: "Distribuidor", label: "Distribuidor" },
    { value: "Revendedor", label: "Revendedor" },
  ]

  const cuantos_productos: Proveedor[] = [
    { value: "Entre 1 y 20", label: "Entre 1 y 20" },
    { value: "Entre 20 y 100", label: "Entre 20 y 100" },
    { value: "Entre 100 y 500", label: "Entre 100 y 500" },
    { value: "Más de 500", label: "Más de 500" },
  ]

  const elementos_por_producto: Proveedor[] = [
    { value: "Entre 1 y 20", label: "Entre 1 y 20" },
    { value: "Entre 20 y 100", label: "Entre 20 y 100" },
    { value: "Entre 100 y 500", label: "Entre 100 y 500" },
    { value: "Más de 500", label: "Más de 500" },
  ]
  const [supplierDocuments, setSuplierDocuments] = useState<File>()
  const [fileFrontDocument, setFileFrontDocumet] = useState<File>()
  const [fileRevertDocument, setFileRevertDocument] = useState<File>()
  const [fileAddressProod, setFileAddressProod] = useState<File>()
  const [sentMessage, setSentMessage] = useState<boolean>(false)
  const [valueInputOptionsLinks, setValueInputOptionsLinks] = useState<{
    value: string
    arrayValue: Array<string>
  }>({
    value: "",
    arrayValue: [],
  })
  const [valueInputOptions, setValueInputOptions] = useState<{
    value: string
    arrayValue: Array<string>
  }>({
    value: "",
    arrayValue: [],
  })

  useEffect(() => {
    if (data) {
      setFormData(data)
      setValueInputOptions({
        value: "",
        arrayValue: data.example_product.split(", "),
      })
      setValueInputOptionsLinks({
        value: "",
        arrayValue: data.current_stock_distribution.split(", "),
      })
    }
  }, [data])

  const [error, setErrors] = useState({
    valueInputOptionsLinks: false,
    valueInputOptions: false,
    supplierDocuments: false,
    fileFrontDocument: false,
    fileRevertDocument: false,
    fileAddressProod: false,
  })

  const validateFiles = () => {
    const newErrors = {
      valueInputOptionsLinks: valueInputOptionsLinks.arrayValue.length
        ? false
        : true,
      valueInputOptions: valueInputOptions.arrayValue.length ? false : true,
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }))
    return !Object.values(newErrors).some((value) => value)
  }

  const onSubmit = handleSubmit(async () => {
    //Enviar solicitud después de completar todos los pasos
    const isValid = validateFiles()
    if (!isValid) return
    formData.id = data?.id || ""
    formData.example_product = valueInputOptions.arrayValue.join(", ")
    formData.current_stock_distribution =
      valueInputOptionsLinks.arrayValue.join(", ")

    actionUpdateSellerApplication(
      formData,
      fileFrontDocument,
      fileRevertDocument,
      fileAddressProod,
      supplierDocuments
    ).then((e) => {
      onClose()
      handlerReset()
    })
  })

  const handlerControlVariant = (e: any) => {
    if (e.includes(",")) {
      setValueInputOptions((data) => ({
        value: "",
        arrayValue: [...data.arrayValue, e.slice(0, -1)],
      }))
    } else {
      setValueInputOptions((data) => ({ ...data, value: e }))
    }
  }
  const handlerTrashVariant = (valueOption: string) => {
    if (!valueInputOptions.arrayValue.length) return
    setValueInputOptions((data) => ({
      ...data,
      arrayValue: data.arrayValue.filter((v) => v !== valueOption),
    }))
  }

  const handlerControlLinks = (e: any) => {
    if (e.includes(",")) {
      setValueInputOptionsLinks((data) => ({
        value: "",
        arrayValue: [...data.arrayValue, e.slice(0, -1)],
      }))
    } else {
      setValueInputOptionsLinks((data) => ({ ...data, value: e }))
    }
  }
  const handlerTrashLinks = (valueOption: string) => {
    if (!valueInputOptionsLinks.arrayValue.length) return
    setValueInputOptionsLinks((data) => ({
      ...data,
      arrayValue: data.arrayValue.filter((v) => v !== valueOption),
    }))
  }

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
          value={formData.name}
          {...register("name")}
          autoComplete="on"
          //errors={errors}
          //errorMessage=""
          onChange={handleInputChange}
        />

        <Input
          label="Apellidos"
          value={formData.last_name}
          {...register("last_name")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Correo electrónico"
          value={formData.email}
          {...register("email")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Numero telefónico"
          value={formData.phone}
          {...register("phone")}
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
          value={formData.contry}
          {...register("contry")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad"
          value={formData.city}
          {...register("city")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección"
          value={formData.address}
          {...register("address")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Código postal"
          value={formData.postal_code}
          {...register("postal_code")}
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
          value={formData.supplier_name}
          {...register("supplier_name")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />

        <Autocomplete
          //variant={variant}
          defaultItems={tipo_proveedor}
          label="Tipo de proveedor"
          {...register("supplier_type")}
          defaultSelectedKey={data?.supplier_type}
          className="max-w"
          onInputChange={(e) => handleAutocompletChange(e, "supplier_type")}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          label="Nombre de empresa proveedora"
          value={formData.company_name}
          {...register("company_name")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="País de la empresa proveedora"
          value={formData.company_country}
          {...register("company_country")}
          autoComplete="number"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad del proveedor"
          value={formData.company_city}
          {...register("company_city")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección del proveedor"
          value={formData.company_address}
          {...register("company_address")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="text-xl font-extrabold  text-center">Orígen del stock</p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos del proveedor
        </p>
        <div className="my-2 flex justify-center">
          <InputFile
            label="Documentos del proveedor "
            preview={data?.supplier_documents}
            //errors={errors}
            alt="fileFrontDocument"
            file={supplierDocuments}
            setFile={setSuplierDocuments}
          />
        </div>
        <p className="text-base my-3 font-bold text-red-600">
          {error.supplierDocuments ? "** Sube un documento ** " : ""}
        </p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          ¿Que venderas?
        </p>

        <Autocomplete
          //variant={variant}
          defaultItems={cuantos_productos}
          defaultSelectedKey={data?.quantity_products_sale}
          label="¿Cuántos productos venderás?"
          {...register("quantity_products_sale")}
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
        <div>
          <Input
            label={`Separa los productos por ","`}
            placeholder="Gif Cards, Software, Plantillas"
            value={valueInputOptions.value}
            onChange={(e) => handlerControlVariant(e.target.value)}
          />
          <p className="my-2 mx-3 gap-2">
            {" "}
            {valueInputOptions.arrayValue.length ? (
              valueInputOptions.arrayValue.map((v: string, i) => (
                <>
                  <button
                    className=" m-1 px-2 py-1 rounded-[10px] bg-slate-300 w-auto "
                    onClick={() => handlerTrashVariant(v)}
                  >
                    <span className="flex gap-1 text-xs items-center">
                      {" "}
                      {v} <XCircleSolid />{" "}
                    </span>
                  </button>
                </>
              ))
            ) : (
              <></>
            )}
          </p>
        </div>
        <p className="text-base my-3 font-bold text-red-600">
          {error.valueInputOptions ? "** Ingresa un valor **" : ""}
        </p>
        {/* <Input
          label="Ejemplos"
          {...register("example_product", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        /> */}

        <Autocomplete
          //variant={variant}
          defaultItems={elementos_por_producto}
          defaultSelectedKey={data?.quantity_per_product}
          label="Cantidad de productos de elementos por producto"
          {...register("quantity_per_product")}
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
        <div>
          <Input
            label={`Separa los links por ","`}
            placeholder="Linkending, web, portafolio"
            value={valueInputOptionsLinks.value}
            onChange={(e) => handlerControlLinks(e.target.value)}
          />
          <p className="my-2 mx-3 gap-2">
            {" "}
            {valueInputOptionsLinks.arrayValue.length ? (
              valueInputOptionsLinks.arrayValue.map((v: string, i) => (
                <>
                  <button
                    className=" m-1 px-2 py-1 rounded-[10px] bg-slate-300 w-auto "
                    onClick={() => handlerTrashLinks(v)}
                  >
                    <span className="flex gap-1 text-xs items-center">
                      {" "}
                      {v} <XCircleSolid />{" "}
                    </span>
                  </button>
                </>
              ))
            ) : (
              <></>
            )}
          </p>
        </div>
        <p className="text-base my-3 font-bold text-red-600">
          {error.valueInputOptionsLinks ? "** Ingresa un valor **" : ""}
        </p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Verificación comercial
        </p>
        <div className=" flex flex-col items-center">
          <InputFile
            label="Documento de identidad parte frontal "
            //errors={errors}
            preview={data?.front_identity_document}
            alt="fileFrontDocument "
            file={fileFrontDocument}
            setFile={setFileFrontDocumet}
          />
          <p className="text-base my-3 font-bold text-red-600">
            {error.fileFrontDocument ? "** Sube un documento **" : ""}
          </p>
          <InputFile
            label="Documento de identidad parte posterior "
            //errors={errors}
            preview={data?.revers_identity_document}
            alt="fileRevertDocument"
            file={fileRevertDocument}
            setFile={setFileRevertDocument}
          />
          <p className="text-base my-3 font-bold text-red-600">
            {error.fileRevertDocument ? "** Sube un documento **" : ""}
          </p>
          <InputFile
            label="Comprobante de domicilio"
            alt="FileAddressProod"
            preview={data?.address_proof}
            //errors={errors}
            file={fileAddressProod}
            setFile={setFileAddressProod}
          />
          <p className="text-base my-3 font-bold text-red-600">
            {error.fileAddressProod ? "** Sube un documento **" : ""}
          </p>
        </div>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Métodos de pago
        </p>
        <Input
          label="Campo 1 "
          value={formData.field_payment_method_1}
          {...register("field_payment_method_1")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Campo 2 "
          value={formData.field_payment_method_2}
          {...register("field_payment_method_2")}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="text-base my-3 font-bold text-red-600">
          {error.fileAddressProod ||
          error.fileFrontDocument ||
          error.fileRevertDocument ||
          error.valueInputOptions ||
          error.valueInputOptionsLinks ||
          error.supplierDocuments
            ? " ** Tienes datos sin completar **"
            : ""}
        </p>
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

export default SellerUpdateRequest
