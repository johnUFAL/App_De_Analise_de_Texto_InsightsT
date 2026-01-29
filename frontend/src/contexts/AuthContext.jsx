import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

 const login = async (email, senha) => {
  try {
    const response = await authAPI.login(email, senha)
    const { access_token } = response.data 
    
    localStorage.setItem('token', access_token)
    setToken(access_token)
    await loadUser()
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    
    let errorMessage = 'Erro ao fazer login'
    
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || errorMessage
      } 
      else if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

 const register = async (name, email, senha) => {
  try {
    const response = await authAPI.register({ 
      nome: name, 
      email, 
      senha: senha 
    })
    
    console.log('Registro bem-sucedido:', response.data)
    
    return await login(email, senha)
    
  } catch (error) {
    console.error('Register error:', error)
    
    let errorMessage = 'Erro ao registrar'
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || errorMessage
      } else if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail
      }
    }
    
    return { 
      success: false, 
      error: errorMessage 
    }
  }
}

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      token 
    }}>
      {children}
    </AuthContext.Provider>
  )
}