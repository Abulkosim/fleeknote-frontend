import axios from 'axios'
import { useRouter } from 'vue-router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  // TODO: fix router usage
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      useRouter().push('/login')
    }
    return Promise.reject(error)
  }
)

export default apiClient 