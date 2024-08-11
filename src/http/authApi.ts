import http from './http'
import { Address, Role } from './shopApi'

export const initialUser: User = {
    id: '',
    name: '',
    email: '',
    image: null,
    status: false,
    verify: false,
    authType: '',
    roles: [],
    createdAt: '',
    updatedAt: '',
    oauth2Id: null,
    addressShipping: '',
    slug: '',

    followers: [],
    phone: '',
}

export type User = {
    id: string
    name: string
    email: string
    image: string | null
    status: boolean
    verify: boolean
    authType: string
    roles: Role[]
    updatedAt?: string
    oauth2Id: string | null
    addressShipping: string
    createdAt: string
    slug: string

    followers?: string[]
    address?: Address[]
    phone?: string
}

export type Auth = {
    user: User
    token: { accessToken: string; refreshToken: string }
}

const authApi = {
    login: (body: any) => http.post<Auth>('/auth/login', body),

    register: (body: any) => http.post<Auth>('/auth/register', body),

    registerShop: (id: string) => http.post<Auth>(`/auth/register-shop/${id}`),

    getProfile: () => http.post<User>('/user/profile'),

    registerUserMod: () => http.get<User>('/auth/create-user-mod'),

    getShop: (shopId: string) => http.get<User>(`/user/${shopId}`),
}

export default authApi
