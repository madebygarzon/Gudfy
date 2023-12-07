import axios from "axios";

export const getListSellerApplication = async () => {
  try {
    const getlist = await axios.get(
      "http://localhost:9000/admin/sellerapplication"
    );

    console.log(getlist);
  } catch (error) {
    console.log(error.message);
  }
};
