import axios from "axios";
 const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
 })

 api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    console.log('TOKEN', token)
    console.log('URL', config.url)

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    console.log("AUTH HEADER", config.headers.Authorization)

    return config
 },(error) => {
    return Promise.reject(error);
 });

 export default api