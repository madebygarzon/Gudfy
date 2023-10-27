import axios, { AxiosResponse } from "axios"

export async function getContries() {
  try {
    const response = await axios
      .get("https://restcountries.com/v2/all")
      .then((e) => {
        const countries = e.data.map((o: any) => {
          return {
            name: o.name,
            flags: o.flags.svg,
            callingCodes: o.callingCodes[0],
          }
        })

        return countries
      })
    return response
  } catch (error) {
    console.error("Error al obtener datos de países:", error)
    throw error
  }
}
