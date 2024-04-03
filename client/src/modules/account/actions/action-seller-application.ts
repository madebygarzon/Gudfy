import axios, { AxiosResponse } from "axios"
import { SellerCredentials } from "types/global"

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

export async function actionUpdateSellerApplication(
  data: SellerCredentials,
  fileFront?: File,
  fileRevers?: File,
  fileAddress?: File,
  supplierDocuments?: File
) {
  try {
    const formData = new FormData()
    formData.append("applicationData", JSON.stringify(data))
    if (fileFront) formData.append("frontDocument", fileFront)
    if (fileRevers) formData.append("reversDocument", fileRevers)
    if (fileAddress) formData.append("addressDocument", fileAddress)
    if (supplierDocuments)
      formData.append("supplierDocuments", supplierDocuments)
    const dataCreateSeller = await axios.post(
      "http://localhost:9000/store/account/uptade-seller-application/",
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
