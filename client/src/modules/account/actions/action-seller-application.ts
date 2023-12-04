import axios, { AxiosResponse } from "axios"

export async function actionSellerApplication(customer_id: string) {
  console.log(customer_id)
  await axios
    .get("http://localhost:9000/store/account/seller-application/", {
      params: { customer_id },
    })
    .then((e) => console.log("echooooooooo", e))
    .catch((e) => console.log("error", e))
}
