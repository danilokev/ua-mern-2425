import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'
// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user)
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

// Login
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, email }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const response = await authService.updateProfile({ name, email }, token)

      // Actualizar localStorage
      const updatedUser = { ...thunkAPI.getState().auth.user, ...response }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error))
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.updatePassword(
        { currentPassword, newPassword },
        token
      )
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error))
    }
  }
)

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (avatarFile, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const response = await authService.updateAvatar(avatarFile, token)

      // Actualizar localStorage
      const updatedUser = {
        ...thunkAPI.getState().auth.user,
        avatar: response.avatar
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error))
    }
  }
)

// --- Eliminar Cuenta ---
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (password, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      await authService.deleteAccount(password, token)

      // Limpiar localStorage y estado
      thunkAPI.dispatch(logout())
      thunkAPI.dispatch(reset())

      return true
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error))
    }
  }
)

// Función auxiliar para manejar errores
const handleError = (error) => {
  return (
    (error.response &&
      error.response.data &&
      error.response.data.message) ||
    error.message ||
    error.toString()
  )
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = { ...state.user, ...action.payload }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = 'Contraseña actualizada correctamente'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user.avatar = action.payload.avatar
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = 'Cuenta eliminada exitosamente'
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer