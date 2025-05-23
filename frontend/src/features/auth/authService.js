import axios from 'axios'
const API_URL = '/api/users/'
// const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'me', userData, config)
  return response.data
}

// --- Actualizar contraseña ---
const updatePassword = async (passwords, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'password', passwords, config)
  return response.data
}

// --- Actualizar Avatar Usuario ---
const updateAvatar = async (avatarFile, token) => {
  const formData = new FormData()
  formData.append('avatar', avatarFile)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }

  const response = await axios.put(API_URL + 'avatar', formData, config)
  return response.data
}

// --- Eliminar Cuenta Usuario ---
const deleteAccount = async (password, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const res = await axios.delete(API_URL + 'me', {
    ...config,
    data: { password }
  })

  return res.data
}

const authService = {
  register,
  login,
  logout,
  updateAvatar,
  updateProfile,
  updatePassword,
  deleteAccount
}

export default authService