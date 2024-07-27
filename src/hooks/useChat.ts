// // src/hooks/useChat.ts
// import socketService, { ChatPayload } from '@/socketService'
// import { useEffect, useState } from 'react'
// import useAuth from './useAuth'

// import { ChatContext } from '@/contexts/ChatContext'
import { ChatContext } from '@/contexts/ChatContext'
import { useContext } from 'react'

// const useChat = (receiverId: string | null) => {
//     const [messages, setMessages] = useState<ChatPayload[]>([])
//     const [error, setError] = useState<string | null>(null)
//     const { user, isAuthenticated } = useAuth()
//     const destination = receiverId ? `/user/${receiverId}/private` : ''

//     useEffect(() => {
//         if (!receiverId || !isAuthenticated) return

//         // Kết nối đến WebSocket khi component mount
//         socketService.connect()

//         // Đăng ký nhận tin nhắn cho destination
//         const handleMessage = (message: ChatPayload) => {
//             setMessages((prevMessages) => [...prevMessages, message])
//         }

//         socketService.subscribe(destination, handleMessage, (e) => setError(e))

//         return () => {
//             socketService.unsubscribe(destination)
//         }
//     }, [receiverId, isAuthenticated])

//     const sendMessage = (body: string) => {
//         if (socketService.isConnected() && user?.id && receiverId) {
//             socketService.sendMessage('/app/chat.send', {
//                 message: body,
//                 senderId: user.id,
//                 receiverId: receiverId,
//             })
//         } else {
//             console.error(
//                 'WebSocket is not connected or user is not authenticated or receiverId is null'
//             )
//         }
//     }

//     return { messages, sendMessage, error }
// }

// export default useChat

const useChat = () => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

export default useChat
