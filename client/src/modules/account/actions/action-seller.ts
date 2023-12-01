import axios, { AxiosResponse } from "axios"

export async function handlerseller(customer) {
  await axios
    .post("http://localhost:9000/store/account/seller/", customer)
    .then()
    .catch((e) => console.log("error", e))
}
