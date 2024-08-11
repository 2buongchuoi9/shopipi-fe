import { User } from './authApi'
import http, { Page } from './http'
import { NotificationType } from '@/utils/constants'

export type Notify = {
    id: string
    userFrom: User
    content: string
    type: string
    read: boolean
    createdAt: string
    notificationType: keyof typeof NotificationType
}

const notifyApi = {
    get: async (userId: string, params: any) =>
        await http.get<Page<Notify>>(`/notify/${userId}`, { params }),
}

export default notifyApi
