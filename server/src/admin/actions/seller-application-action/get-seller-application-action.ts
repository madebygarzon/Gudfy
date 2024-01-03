import axios from "axios";
axios.defaults.withCredentials = true;
export const getListSellerApplication = async () => {
  try {
    const getlist = await axios.get(
      "http://localhost:9000/admin/sellerapplication",
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
