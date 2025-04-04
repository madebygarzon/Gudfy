import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Autocomplete, AutocompleteItem } from "@heroui/react"
//import Input from "@modules/common/components/input"
import { Input } from "@heroui/react"
import { FieldValues, useForm } from "react-hook-form"
import { actionCreateSellerApplication } from "@modules/account/actions/action-seller-application"

interface Proveedor {
  value: string
  label: string
}

interface SellerCredentials extends FieldValues {
  nombre_vendedor: string
  apellidos_vendedor: string
  correo_electronico_vendedor: string
  numero_de_telefono_vendedor: string
  pais_vendedor: string
  ciudad_vendedor: string
  direccion_vendedor: string
  codigo_postal_vendedor: string
  nombre_proveedor: string
  tipo_proveedor: string
  nombre_empresa_proveedor: string
  pais_proveedor: string
  ciudad_proveedor: string
  direccion_proveedor: string
  documentos_proveedor: File | null
  productos_diferentes: string
  nombre_producto_ejemplo: string
  cantidad_por_producto: string
  enlaces_webs_venta: string
  documento_de_identidad: File | string
  comprobante_domicilio: File | string
  campo1_metodo_pago: string
  campo2_metodo_pago: string
}

const SellerRequestCompany = () => {
  const [formData, setFormData] = useState({
    nombre_vendedor: "",
    apellidos_vendedor: "",
    correo_electronico_vendedor: "",
    numero_de_telefono_vendedor: "",
    pais_vendedor: "",
    ciudad_vendedor: "",
    direccion_vendedor: "",
    codigo_postal_vendedor: "",
    nombre_proveedor: "",
    tipo_proveedor: "",
    nombre_empresa_proveedor: "",
    pais_proveedor: "",
    ciudad_proveedor: "",
    direccion_proveedor: "",
    documentos_proveedor: null,
    productos_diferentes: "",
    nombre_producto_ejemplo: "",
    cantidad_por_producto: "",
    enlaces_webs_venta: "",
    front_identity_document: null,
    subsequent_identity_document: null,
    comprobante_domicilio: null,
    campo1_metodo_pago: "",
    campo2_metodo_pago: "",
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

  const [file, setFile] = useState()

  const onSubmit = handleSubmit(async () => {
    //Enviar solicitud después de completar todos los pasos
    // actionCreateSellerApplication(
    //   customer_id,
    //   formData.identification_number,
    //   formData.address
    // ).then(() => {
    //   handlerReset()
    // })
  })

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
          {...register("nombre_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          //errorMessage=""
          onChange={handleInputChange}
        />

        <Input
          label="Apellidos"
          {...register("apellidos_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Correo electrónico"
          {...register("correo_electronico_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Numero telefónico"
          {...register("numero_de_telefono_vendedor", {
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
          {...register("pais_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad"
          {...register("ciudad_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección"
          {...register("direccion_vendedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Código postal"
          {...register("codigo_postal_vendedor", {
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
          {...register("nombre_proveedor", {
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
          {...register("tipo_proveedor", {
            required: "Campo requerido",
          })}
          className="max-w"
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          label="Nombre de empresa proveedora"
          {...register("nombre_empresa_proveedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="País de la empresa proveedora"
          {...register("pais_proveedor", {
            required: "Campo requerido",
          })}
          autoComplete="number"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Ciudad del proveedor"
          {...register("ciudad_proveedor", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Dirección del proveedor"
          {...register("direccion_proveedor", {
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
          {...register("documentos_proveedor", {
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
          {...register("productos_diferentes", {
            required: "Campo requerido",
          })}
          className="max-w"
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
          {...register("nombre_producto_ejemplo", {
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
          {...register("productos_diferentes", {
            required: "Campo requerido",
          })}
          className="max-w"
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
          {...register("enlaces_webs_venta", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <p className="font-semibold text-gray-800 text-sm text-center">
          Verificación comercial
        </p>
        <Input
          label="Documento de identidad "
          {...register("documento_de_identidad", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
        />
        <Input
          label="Comprobante de domicilio "
          {...register("comprobante_domicilio", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          //errors={errors}
          onChange={handleInputChange}
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
          //onClick={() => actionCreateSellerApplication()}
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

export default SellerRequestCompany
