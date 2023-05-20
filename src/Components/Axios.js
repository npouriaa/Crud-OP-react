import axios from "axios";

const axiosURL = axios.create({
  baseURL: "https://64649d75043c103502be02f0.mockapi.io/crudData",
});

export default axiosURL;
