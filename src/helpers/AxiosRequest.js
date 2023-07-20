import axios from "axios";
// import { toast } from "react-toastify";


export const getHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (token)
    return {
      Authorization: `Bearer ${token}`,
    };
};

// Create Instance For Api Call.
const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

AxiosInstance.interceptors.request.use(function (config) {
    config.params = config.params || {};
    config.params['t'] = new Date().valueOf();
    if (localStorage.getItem("accessToken")) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
    }
    return config;
});

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
       // toast.error(error?.response?.data?.message || 'Something went wrong')
        return error
    }
);

export default AxiosInstance;