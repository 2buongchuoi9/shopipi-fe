// // src/components/Chat.tsx
// import { accessToken, clientId } from '@/utils/localStorageUtils'
// import React, { useEffect, useState, useCallback } from 'react'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'

// const SOCKET_URL = import.meta.env.VITE_API_URL + '/ws'

// const Chat_1 = ({ recipient }: { recipient: string }) => {
//     const [messages, setMessages] = useState<any[]>([])
//     const [input, setInput] = useState<string>('')
//     const [client, setClient] = useState<Stomp.Client | null>(null)
//     const [isConnected, setIsConnected] = useState(false)

//     const connect = useCallback(() => {
//         const sockJS = new SockJS(SOCKET_URL)
//         const stompClient = Stomp.over(sockJS)

//         stompClient.connect(
//             {
//                 authorization: accessToken.get() ?? '',
//                 'x-client-id': clientId.get() ?? '',
//             },
//             () => {
//                 console.log('Connected to WebSocket')
//                 setIsConnected(true)
//                 stompClient.subscribe(`/user/queue/messages`, (message) => {
//                     setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)])
//                 })
//                 stompClient.subscribe(`/queue/message`, (message) => {
//                     setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)])
//                 })
//             },
//             (error) => {
//                 console.error('Failed to connect to WebSocket', error)
//                 setTimeout(connect, 5000) // Retry after 5 seconds
//             }
//         )

//         setClient(stompClient)
//     }, [])

//     useEffect(() => {
//         connect()
//         return () => {
//             if (client && client.connected) {
//                 client.disconnect(() => {
//                     console.log('Disconnected from WebSocket')
//                     setIsConnected(false)
//                 })
//             }
//         }
//     }, [connect, client])

//     const sendMessage = () => {
//         if (client && client.connected) {
//             client.send(
//                 `/app/chat.send/${recipient}`,
//                 {},
//                 JSON.stringify({
//                     sender: clientId.get(), // Change to your user ID
//                     content: input,
//                     type: 'CHAT',
//                 })
//             )
//             setInput('')
//         } else {
//             console.error('WebSocket is not connected')
//         }
//     }

//     return (
//         <div>
//             <div>
//                 {messages.map((msg, index) => (
//                     <div key={index}>{msg.content}</div>
//                 ))}
//             </div>
//             <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     )
// }

// export default Chat_1
