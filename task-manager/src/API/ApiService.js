import axios from 'axios';

const url = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

url.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `${token}`;
    return config;
}, (error) => Promise.reject(error));

export default url;