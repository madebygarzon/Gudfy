 import axios, { AxiosResponse } from "axios"
 import { BACKEND_URL } from "./"
 
 export async function getListCategories() {
   try {
     const response = await axios.get(
       `${BACKEND_URL}/store/list-product-category/`,
       {
         withCredentials: true,
       }
     )
 
     return response.data
   } catch (error) {
     console.error(
       "Eror al obtener la lista de categorias:",
       error
     )
     throw error
   }
 }
 