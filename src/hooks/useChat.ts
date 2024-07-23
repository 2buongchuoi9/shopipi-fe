import socketService from '@/socketService'
import { useEffect, useState } from 'react'
import useAuth from './useAuth'

const useChat = (destination: string) => {
    const [messages, setMessages] = useState<string[]>([])
    const { user } = useAuth()

    useEffect(() => {
        // Kết nối đến WebSocket khi component mount
        socketService.connect()

        // Đăng ký nhận tin nhắn cho destination
        const handleMessage = (message: any) => {
            setMessages((prevMessages) => [...prevMessages, message])
        }

        socketService.subscribe('/message', handleMessage)
    }, [destination])

    const sendMessage = (body: string) => {
        if (socketService.isConnected()) {
            socketService.sendMessage('/message', {
                sender: user.id, //
                content: body,
                type: 'CHAT',
            })
        } else {
            console.error('WebSocket is not connected')
        }
    }

    return { messages, sendMessage }
}

export default useChat
