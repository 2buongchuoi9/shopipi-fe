import { useCart } from '@/hooks'
import { ErrorPayload } from '@/http'
import authApi, { initialUser, User } from '@/http/authApi'
import socketService from '@/socketService'
import { accessToken, clientId, refreshTokenStorage } from '@/utils/localStorageUtils'
import { createContext, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface AuthContextType {
    user: User
    fetchUser: () => Promise<void>
    isAuthenticated: boolean
    setUser: (user: User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(initialUser)
    const { fetchCart } = useCart()
    const isAuthenticated = useRef<boolean>(false)

    const fetchUser = async () => {
        try {
            const user = await authApi.getProfile()
            setUser(user)
            isAuthenticated.current = true
        } catch (error) {
            if (error instanceof ErrorPayload) {
                console.log('Failed to fetch user', error)

                isAuthenticated.current = false
                setUser(initialUser)
            }
        }
    }

    const logout = () => {
        setUser(initialUser)
        isAuthenticated.current = false
        clientId.remove()
        accessToken.remove()
        refreshTokenStorage.remove()
        fetchCart()
    }

    useLayoutEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        if (!isAuthenticated.current) socketService.connect()

        return () => {
            if (!isAuthenticated.current && socketService.isConnected()) socketService.disconnect()
        }
    }, [isAuthenticated.current])

    return (
        <AuthContext.Provider
            value={{
                user,
                fetchUser,
                setUser,
                isAuthenticated: isAuthenticated.current,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
