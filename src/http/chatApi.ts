import { ChatPayload } from '@/socketService'
import http, { Page, ParamsRequest } from './http'
import { User } from './authApi'

export type ChatGroup = {
    senderId: string
    chats: ChatPayload[]
    createdAt: string // Thời gian đầu tiên của nhóm tin nhắn
}

const chatApi = {
    getChatList: async (userId_1: string, userId_2: string, params?: ParamsRequest) =>
        await http.get<Page<ChatPayload>>('/chat/list', {
            params: { userId_1, userId_2, ...params },
        }),

    getUserChattedWithUser: async (userId: string) =>
        await http.get<User[]>(`/chat/user-chatted/${userId}`),

    getChatDetail: '/chat/detail',
    sendMsg: '/chat/send',
}

export default chatApi
