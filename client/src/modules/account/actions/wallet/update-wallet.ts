import axios from "axios"
import { BACKEND_URL } from ".."


export const updateWallet = async (walletAddress: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/seller/store/update-wallet/`,
      {
        wallet_address: walletAddress,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    return true
  } catch (error: any) {
    console.log("error en la solicitud del update wallet", error.message)
  }
}
