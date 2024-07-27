// ChatContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react'
import { Shop } from '@/http'

export interface ChatContextProps {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    selectedUser: Shop | null
    setSelectedUser: Dispatch<SetStateAction<Shop | null>>
    count: number
    setCount: Dispatch<SetStateAction<number>>
}

export const ChatContext = createContext<ChatContextProps | undefined>({
    visible: false,
    setVisible: () => {},
    selectedUser: null,
    setSelectedUser: () => {},
    count: 0,
    setCount: () => {},
})

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Shop | null>(null)
    const [count, setCount] = useState<number>(0)

    return (
        <ChatContext.Provider
            value={{ visible, setVisible, selectedUser, setSelectedUser, count, setCount }}
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
