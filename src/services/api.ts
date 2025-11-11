import axios, { type AxiosInstance } from 'axios'

// Read the base URL from Vite env; fall back to the local API URL if not set
const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:5050/api'

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
