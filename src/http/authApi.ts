import http from './http'

export const initialUser = {
    id: '',
    name: '',
    email: '',
    image: null,
    status: false,
    verify: false,
    authType: '',
    roles: [],
    address: null,
    createdAt: '',
    updateAt: '',
    oauth2Id: null,
    addressShipping: '',
    createAt: '',
}

export type User = {
    id: string
    name: string
    email: string
    image: string | null
    status: boolean
    verify: boolean
    authType: string
    roles: string[]
    address: string | null
    createdAt: string
    updateAt: string
    oauth2Id: string | null
    addressShipping: string
    createAt: string
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
