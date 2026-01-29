import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

//interceptador de request para debug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', config.method, config.url, config.headers)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

//interceptador de response para debug
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url, response.data)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url, error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('Token expirado ou inválido, redirecionando para login...')
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

//endpoint de autenticação
export const authAPI = {
    register: (data) => api.post('/auth/criar_conta', data),
    login: (email, senha) => api.post('/auth/login', { 
      email: email, 
      senha: senha 
    }),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.get('/auth/refresh_token'),
}

//endpoint de analise
export const analysisAPI = {
    analyzeText: (texto, salvar_historico = true) => api.post('/analysis/analysis', { 
      texto_original: texto,
      salvar_historico: salvar_historico 
    }),
    getHistory: () => api.get('/analysis/history'),
    getAnalysisById: (id) => api.get(`/analysis/${id}`),
    analyzeTopic: (texto) => api.post('/analysis/topic', { 
      texto_original: texto 
    }),
}

export default api