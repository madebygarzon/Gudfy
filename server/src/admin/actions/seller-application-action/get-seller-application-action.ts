import axios from "axios";

export const getListSellerApplication = async () => {
  try {
    const getlist = await axios.get(

      "http://localhost:9000/admin/sellerapplication",
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {
    console.log(error.message);

  }
};
