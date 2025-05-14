import React, { useState, useEffect, SetStateAction, useRef } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Autocomplete, AutocompleteItem } from "@heroui/react"
import { Input } from "@heroui/react"
import { FieldValues, useForm } from "react-hook-form"
import { actionUpdateSellerApplication } from "@modules/account/actions/action-seller-application"
import { XCircleSolid } from "@medusajs/icons"
import CustomSelectCountry from "@modules/common/components/select_country/customSelectCountry"
import type { SellerCredentials as SellerCredentialsGlobal } from "types/global"

interface Proveedor {
  value: string
  label: string
}

// Extendemos el tipo SellerCredentials para incluir el id
type SellerCredentials = SellerCredentialsGlobal & {
  id: string
}

// Interfaz interna para nuestro formulario simplificado
interface SimpleFormData {
  id: string
  name: string
  last_name: string
  email: string
  phone: string
  contry: string
  example_product: string
  field_payment_method_1: string
  field_payment_method_2: string
}

type props = {
  data?: SellerCredentials
  onClose: () => void
  handlerReset: () => void
}

const SellerUpdateRequestSimple = ({ onClose, handlerReset, data }: props) => {
  const [formData, setFormData] = useState<SimpleFormData>({
    id: "",
    name: "",
    last_name: "",
    email: "",
    phone: "",
    contry: "Colombia",
    example_product: "",
    field_payment_method_1: "",
    field_payment_method_2: "",
  })
  
  // Creamos archivos vacíos para cumplir con la firma de la función actionUpdateSellerApplication
  // pero no los mostraremos en la interfaz - son opcionales en la actualización
  const [fileFrontDocument, setFileFrontDocumet] = useState<File>()
  const [fileRevertDocument, setFileRevertDocument] = useState<File>()
  const [fileAddressProod, setFileAddressProod] = useState<File>()
  const [supplierDocuments, setSupplierDocuments] = useState<File>()
  
  // Estado para el código de país
  const [codeFlag, setCodeFlag] = useState<number>(57)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()
  const first = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target
    const value = e.target.value
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const [valueInputOptions, setValueInputOptions] = useState<{
    value: string
    arrayValue: Array<string>
  }>({
    value: "",
    arrayValue: [],
  })

  const [error, setErrors] = useState({
    valueInputOptions: false,
  })

  // Cargar los datos iniciales cuando se proporciona data
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id || "",
        name: data.name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        contry: data.contry || "Colombia",
        example_product: data.example_product || "",
        field_payment_method_1: data.field_payment_method_1 || "",
        field_payment_method_2: data.field_payment_method_2 || "",
      })
      
      // Inicializar los productos a vender
      setValueInputOptions({
        value: "",
        arrayValue: data.example_product ? data.example_product.split(", ") : [],
      })
      
      // Intentar extraer el código del país para establecer el valor inicial
      // Esto es un ejemplo, podrías necesitar ajustarlo según tus necesidades
      const countryCode = 57; // Por defecto Colombia (57)
      setCodeFlag(countryCode);
    }
  }, [data])

  const validateForm = () => {
    const newErrors = {
      valueInputOptions: valueInputOptions.arrayValue.length ? false : true,
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }))

    return !Object.values(newErrors).some((value) => value)
  }

  const onSubmit = handleSubmit(async () => {
    const isValid = validateForm()
    if (!isValid) return
    
    // Asignar los productos a vender al campo example_product
    formData.example_product = valueInputOptions.arrayValue.join(", ")
    
    // Crear un objeto completo de SellerCredentials con los datos mínimos necesarios
    const sellerData: SellerCredentials = {
      id: formData.id,
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      contry: formData.contry,
      city: data && data.city ? data.city : "",
      address: data && data.address ? data.address : "",
      postal_code: data && data.postal_code ? data.postal_code : "",
      supplier_name: data && data.supplier_name ? data.supplier_name : "",
      supplier_type: data && data.supplier_type ? data.supplier_type : "",
      company_name: data && data.company_name ? data.company_name : "",
      company_country: data && data.company_country ? data.company_country : "",
      company_city: data && data.company_city ? data.company_city : "",
      company_address: data && data.company_address ? data.company_address : "",
      quantity_products_sale: data && data.quantity_products_sale ? data.quantity_products_sale : "",
      example_product: formData.example_product,
      quantity_per_product: data && data.quantity_per_product ? data.quantity_per_product : "",
      current_stock_distribution: data && data.current_stock_distribution ? data.current_stock_distribution : "",
      field_payment_method_1: formData.field_payment_method_1,
      field_payment_method_2: formData.field_payment_method_2,
    }
    
    console.log("sellerData", sellerData)
    
    // Usar la función de actualización con los parámetros requeridos
    actionUpdateSellerApplication(
      sellerData,
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

  const handleSelectCountry = (country: string) => {
    setFormData((prevData) => ({ ...prevData, contry: country }))
  }

  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto" ref={first}>
        <p className="text-xl font-extrabold text-center">
          Actualizar Información Básica
        </p>
        <p className="font-semibold text-gray-800 text-sm text-center">
          Datos personales
        </p>
        <Input
          value={formData.name}
          label="Nombre"
          {...register("name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          onChange={handleInputChange}
        />

        <Input
          value={formData.last_name}
          label="Apellidos"
          {...register("last_name", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          onChange={handleInputChange}
        />

        {/* Usando el componente CustomSelectCountry para seleccionar el país */}
        <CustomSelectCountry
          initialCode={codeFlag}
          setCodeFlag={setCodeFlag}
          setSelectCountry={handleSelectCountry}
        />

        <Input
          value={formData.phone}
          label="Teléfono"
          {...register("phone", {
            required: "Campo requerido",
          })}
          autoComplete="on"
          onChange={handleInputChange}
        />

        <Input
          value={formData.email}
          label="Email"
          {...register("email", {
            required: "Campo requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          })}
          autoComplete="on"
          onChange={handleInputChange}
        />

        <p className="font-semibold text-gray-800 text-sm text-center mt-4">
          Productos a vender
        </p>
        <div>
          <Input
            label={`Separa los productos por ","`}
            placeholder="Gift Cards, Software, Plantillas"
            value={valueInputOptions.value}
            onChange={(e) => handlerControlVariant(e.target.value)}
          />
          <p className="my-2 mx-3 gap-2">
            {valueInputOptions.arrayValue.length ? (
              valueInputOptions.arrayValue.map((v: string, i) => (
                <React.Fragment key={i}>
                  <button
                    type="button"
                    className="m-1 px-2 py-1 rounded-[10px] bg-slate-300 w-auto"
                    onClick={() => handlerTrashVariant(v)}
                  >
                    <span className="flex gap-1 text-xs items-center">
                      {v} <XCircleSolid />
                    </span>
                  </button>
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
          </p>
        </div>

        <p className="text-base my-3 font-bold text-red-600">
          {error.valueInputOptions ? "** Ingresa al menos un producto **" : ""}
        </p>

        <p className="font-semibold text-gray-800 text-sm text-center mt-4">
          <strong>Dirección de tu Wallet</strong> 
          <br />
          En el siguiente campo, por favor ingrese la dirección exacta de su billetera virtual. Esta dirección es necesaria para procesar los pagos de sus ventas y asegurar que los fondos se transfieran correctamente.
        </p>
        <Input
          label="Dirección de tu Wallet"
          {...register("field_payment_method_1", {
            required: "Campo requerido",
          })}
          value={formData.field_payment_method_1}
          autoComplete="on"
          onChange={handleInputChange}
        />
        
        <p className="font-semibold text-gray-800 text-sm text-center">
          Confirmar dirección de wallet
        </p>
        <Input
          label="Dirección de tu Wallet"
          {...register("field_payment_method_2", {
            required: "Campo requerido",
          })}
          value={formData.field_payment_method_2}
          autoComplete="on"
          onChange={handleInputChange}
        />
        {formData.field_payment_method_1 !== formData.field_payment_method_2 && 
          <p className="text-base my-3 font-bold text-red-600">⛓️‍💥 Los campos no coinciden</p>
        }

        <ButtonMedusa
          className="mt-4 mb-4 rounded-[5px]"
          type="submit"
          color="primary"
          disabled={formData.field_payment_method_1 !== formData.field_payment_method_2}
        >
          Actualizar solicitud
        </ButtonMedusa>
      </div>
    </form>
  )
}

export default SellerUpdateRequestSimple
