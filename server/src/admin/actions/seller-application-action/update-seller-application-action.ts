import axios from "axios";

export const updateSellerAplicationAction = async (payload, customer_id) => {
  try {
    const getlist = await axios.post(
      "http://localhost:9000/admin/sellerapplication",
      { payload, customer_id },
      { withCredentials: true }
    );
    console.log(getlist.data);
    return getlist.data;
  } catch (error) {
    console.log(error.message);
  }
};
