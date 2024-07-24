import { message, notification } from 'antd'
import { createContext, ReactNode } from 'react'

export interface MessageContextType {
    loading: (content: string, key?: string) => void
    success: (content: string, key?: string) => void
    error: (content: string, key?: string) => void
    warning: (content: string, key?: string) => void
    close: (key?: string) => void
    notify: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void
}

export const MessageContext = createContext<MessageContextType>({} as MessageContextType)

export default function MessageProvider({ children }: { children: ReactNode }) {
    const [messageApi, contextHolder] = message.useMessage()
    const [api, contextHolderNotify] = notification.useNotification()

    const loading = (content: string, key = '1') =>
        messageApi.open({ key, type: 'loading', content, duration: 5000 })
    const success = (content: string, key = '1') =>
        messageApi.open({ key, type: 'success', content })
    const error = (content: string, key = '1') => messageApi.open({ key, type: 'error', content })
    const warning = (content: string, key = '1') =>
        messageApi.open({ key, type: 'warning', content })
    const close = (key?: string) => messageApi.destroy(key ?? '1')

    const notify = (
        type: 'success' | 'info' | 'warning' | 'error',
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
            placement: 'topLeft',
            showProgress: true,
            key: message,
        })
    }

    return (
        <MessageContext.Provider
            value={{
                loading,
                success,
                error,
                warning,
                close,
                notify,
            }}
        >
            {contextHolder}
            {contextHolderNotify}
            {children}
        </MessageContext.Provider>
    )
}
