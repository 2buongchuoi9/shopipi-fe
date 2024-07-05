import authApi, { User } from '@/http/authApi'
import { createContext, ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react'

interface AuthContextType {
    user: User | null
    fetchUser: () => void
    isAuthenticating: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const isAuthenticated = useRef<boolean>(false)
    const fetchUser = async () => {
        try {
            const user = await authApi.getProfile()
            setUser(user)
            isAuthenticated.current = true
        } catch (error) {
            isAuthenticated.current = false
            setUser(null)
        }
    }

    useLayoutEffect(() => {
        if (!user) fetchUser()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                fetchUser,
                isAuthenticating: isAuthenticated.current,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
