// src/context/ChatContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import socketService, { ChatPayload } from '@/socketService'
import useAuth from '@/hooks/useAuth'

export interface ChatContextProps {
    onNewMessage: (callback: (message: ChatPayload) => void) => void
    // removeMessageCallback: (callback: (message: ChatPayload) => void) => void
    sendMessage: (message: string, receiverId: string) => void
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth()
    const [callbacks, setCallbacks] = useState<((message: ChatPayload) => void)[]>([])

    useEffect(() => {
        if (isAuthenticated && user.id) {
            socketService.connect()
            socketService.subscribe(`/user/${user.id}/private`, handleReceiverNewMessage, (e) => {
                console.error(e)
            })

            return () => {
                if (isAuthenticated && user.id) {
                    socketService.unsubscribe(`/user/${user.id}/private`)
                    socketService.disconnect()
                }
            }
        }
    }, [isAuthenticated, user.id])

    const handleReceiverNewMessage = (message: ChatPayload) => {
        callbacks.forEach((callback) => callback(message))
    }

    const onNewMessage = (callback: (message: ChatPayload) => void) => {
        setCallbacks((prev) => [...prev, callback])
    }

    // const removeMessageCallback = (callback: (message: ChatPayload) => void) => {
    //     setCallbacks((prev) => prev.filter((cb) => cb !== callback))
    // }

    const sendMessage = (message: string, receiverId: string) => {
        if (user.id && isAuthenticated) {
            socketService.sendMessage('/app/chat.send', {
                message,
                senderId: user.id,
                receiverId,
            })
        } else {
            console.error('User is not authenticated')
        }
    }

    return (
        <ChatContext.Provider value={{ onNewMessage, sendMessage }}>
            {children}
        </ChatContext.Provider>
    )
}
