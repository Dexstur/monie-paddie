import axios from "axios";

const { VITE_APP_NODE_ENV } = import.meta.env;
const baseURL =
  VITE_APP_NODE_ENV === "development"
    ? "http://localhost:5500"
    : "https://moniepaddie-api.onrender.com/";
const Api = axios.create({
  baseURL,
  withCredentials: true,
});
// console.log(VITE_APP_NODE_ENV)
// myApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('blogtoken')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default Api;
export { baseURL };
