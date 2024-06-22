import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://16.16.74.176:8000/api/v1'
});

export default axiosInstance;
