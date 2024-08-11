// NotifyContext.tsx
import { User } from '@/http/authApi'
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react'

export interface NotifyContextProps {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    selectedUser: User | null
    setSelectedUser: Dispatch<SetStateAction<User | null>>
    count: number
    setCount: Dispatch<SetStateAction<number>>
}

export const NotifyContext = createContext<NotifyContextProps | undefined>({
    visible: false,
    setVisible: () => {},
    selectedUser: null,
    setSelectedUser: () => {},
    count: 0,
    setCount: () => {},
})

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [count, setCount] = useState<number>(0)

    return (
        <NotifyContext.Provider
            value={{ visible, setVisible, selectedUser, setSelectedUser, count, setCount }}
        >
            {children}
        </NotifyContext.Provider>
    )
}

// export const useNotifyContext = () => {
//     const context = useContext(NotifyContext)
//     if (!context) {
//         throw new Error('useNotifyContext must be used within a NotifyProvider')
//     }
//     return context
// }
