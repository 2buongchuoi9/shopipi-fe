
import { User } from './authApi'
import http, { Page, ParamsRequest } from './http'

export type Role = 'ADMIN' | 'USER' | 'SHOP' | 'MOD'

export type Address = {
    phone?: string
    name?: string
    isDefault: boolean
    province: string
    district: string
    address: string
}

export type Online = {
    userId: string
    isOnline: boolean
    time: string
}

const shopApi = {
    findShop: async (params: ParamsRequest) => await http.get<Page<User>>('/user', { params }),

    findShopBySlug: async (slug: string) => await http.get<User>(`/user/slug/${slug}`),

    followerShop: async (shopId: string) => await http.post<User>(`/user/follow/${shopId}`),

    updateWithFile: async (id: string, data: FormData) =>
        await http.post<User>(`/user/update/file/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    changePassword: async (data: any) => await http.post<boolean>('/user/change-password', data),

    addAddress: async (data: Address) => await http.post<Address>('/user/add-address', data),

    updateAddress: async (index: number, data: Address) =>
        await http.post<Address>(`/user/update-address/${index}`, data),

    deleteAddress: async (index: number) =>
        await http.delete<boolean>(`/user/delete-address/${index}`),

    online: async (userId: string) => await http.get<Online>(`/user/online/${userId}`),
    onlineMany: async (ids: string[]) => {
        const params = new URLSearchParams()
        ids.forEach(id => params.append('ids', id))
        return await http.get<Online[]>(`/user/online-many`, { params })
    },
}

export default shopApi
