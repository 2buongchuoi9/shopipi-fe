import http from './http'

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
    login: (body: any) => http.post<any>('/auth/login', body),

    getProfile: () => http.post<User>('/user/profile'),
}

export default authApi
