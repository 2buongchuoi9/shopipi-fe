// ChatContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react'
import { User } from '@/http/authApi'

export interface ChatContextProps {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    selectedUser: User | null
    setSelectedUser: Dispatch<SetStateAction<User | null>>
    count: number
    setCount: Dispatch<SetStateAction<number>>
    newNotification: boolean
    setNewNotification: Dispatch<SetStateAction<boolean>>
}

export const ChatContext = createContext<ChatContextProps | undefined>({
    visible: false,
    setVisible: () => {},
    selectedUser: null,
    setSelectedUser: () => {},
    count: 0,
    setCount: () => {},
    newNotification: false,
    setNewNotification: () => {},
})

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [count, setCount] = useState<number>(0)
    const [newNotification, setNewNotification] = useState(false)

    return (
        <ChatContext.Provider
            value={{
                visible,
                setVisible,
                selectedUser,
                setSelectedUser,
                count,
                setCount,
                newNotification,
                setNewNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

// export const useChatContext = () => {
//     const context = useContext(ChatContext)
//     if (!context) {
//         throw new Error('useChatContext must be used within a ChatProvider')
//     }
//     return context
// }
