import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
})

// 自动附加 token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
