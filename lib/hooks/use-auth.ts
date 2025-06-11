import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { login, logout, clearError } from "@/lib/redux/features/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { token, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  const loginUser = async (username: string, password: string) => {
    return dispatch(login({ username, password })).unwrap()
  }

  const logoutUser = () => {
    dispatch(logout())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    token,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
    clearError: clearAuthError,
  }
}
