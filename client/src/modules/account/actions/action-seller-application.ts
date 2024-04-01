import axios, { AxiosResponse } from "axios"

export async function actionGetSellerApplication() {
  try {
    const dataSeller = await axios
      .get("http://localhost:9000/store/account/seller-application/", {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((e) => {
        return {
          ...e.data,
        }
      })
    return dataSeller
  } catch (error) {
    return
  }
}

interface SellerCredentials {
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
  //supplier_documents: File | null
  quantity_products_sale: string
  example_product: string
  quantity_per_product: string
  current_stock_distribution: string
  // front_identity_document: File | null
  // revers_identity_document: File | null
  // address_proof: File | null
  // campo1_metodo_pago: string
  // campo2_metodo_pago: string
}

export async function actionCreateSellerApplication(
  data: SellerCredentials,
  fileFront: File,
  fileRevers: File,
  fileAddress: File,
  supplierDocuments: File
) {
  try {
    const formData = new FormData()
    formData.append("applicationData", JSON.stringify(data))
    formData.append("frontDocument", fileFront)
    formData.append("reversDocument", fileRevers)
    formData.append("addressDocument", fileAddress)
    formData.append("supplierDocuments", supplierDocuments)
    const dataCreateSeller = await axios.post(
      "http://localhost:9000/store/account/seller-application/",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return dataCreateSeller
  } catch (error) {
    console.log(error)
  }
}
