import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: { "Content-Type": "application/json" },
})

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lorindo_token")
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("lorindo_refresh")
      if (refresh) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: refresh })
          localStorage.setItem("lorindo_token", data.data.accessToken)
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`
          return api(error.config)
        } catch {
          localStorage.clear()
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)
