import axios from "axios";
import getCookie from "../customFunctions/GetCookie";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: process.env.API_PROD_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials:true
});

// const request = async ({ ...options }, router) => {
//   client.defaults.headers.common.Authorization = `Bearer ${getCookie("uat")}`;
//   const onSuccess = (response) => response;
//   const onError = (error) => {
//     if (error?.response?.status == 401) {
//       Cookies.remove("uat");
//       Cookies.remove("ue");
//       Cookies.remove("account");
//       localStorage.clear();
//       router && router.push("/auth/login");
//     }
//     return error;
//   };
//   try {
//     const response = await client(options);
//     return onSuccess(response);
//   } catch (error) {
//     return onError(error);
//   }
// };

const request = async ({ ...options }, router) => {
  // Optionally set Authorization header if token stored in cookies readable by JS
  const token = Cookies.get("uat"); 
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const onSuccess = (response) => response;

  const onError = (error) => {
    if (error?.response?.status === 401) {
      Cookies.remove("uat");
      Cookies.remove("ue");
      Cookies.remove("account");
      localStorage.clear();
      router && router.push("/auth/login");
    }
    return Promise.reject(error); // reject to properly handle error downstream
  };

  try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default request;
