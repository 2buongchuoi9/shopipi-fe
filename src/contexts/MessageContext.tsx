'use client'
import { message } from 'antd'
import { createContext, ReactNode, useContext } from 'react'

interface MessageContextType {
    loading: (content: string, key?: string) => void
    success: (content: string, key?: string) => void
    error: (content: string, key?: string) => void
    warning: (content: string, key?: string) => void
}

export const MessageContext = createContext<MessageContextType>({} as MessageContextType)

export const useMessage = () => useContext(MessageContext)

export default function MessageProvider({ children }: { children: ReactNode }) {
    const [messageApi, contextHolder] = message.useMessage()

    const loading = (content: string, key = '1') =>
        messageApi.open({ key, type: 'loading', content, duration: 5000 })
    const success = (content: string, key = '1') =>
        messageApi.open({ key, type: 'success', content })
    const error = (content: string, key = '1') => messageApi.open({ key, type: 'error', content })
    const warning = (content: string, key = '1') =>
        messageApi.open({ key, type: 'warning', content })

    return (
        <MessageContext.Provider
            value={{
                loading,
                success,
                error,
                warning,
            }}
        >
            {contextHolder}
            {children}
        </MessageContext.Provider>
    )
}
