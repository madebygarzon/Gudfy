import axios, { AxiosResponse } from "axios"

export async function actionGetSellerApplication(customer_id: string) {
  try {
    const dataSeller = await axios
      .get("http://localhost:9000/store/account/seller-application/", {
        params: { customer_id },
      })
      .then((e) => ({
        application: e.data.application,
        approved: e.data.approved,
        rejected: e.data.rejected,
      }))
    return dataSeller
  } catch (error) {
    return
  }
}

export async function actionCreateSellerApplication(
  customer_id: string,
  identification_number: string,
  address: string
) {
  try {
    const dataCreateSeller = await axios.post(
      "http://localhost:9000/store/account/seller-application/",
      { customer_id, identification_number, address }
    )
    return dataCreateSeller
  } catch (error) {
    console.log(error)
  }
}
