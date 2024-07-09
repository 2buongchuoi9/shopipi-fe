import { accessToken, clientId } from '@/utils/localStorageUtils'
import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'

export type ParamsRequest = {
    page?: number | string | null
    size?: number | string | null
    sort?: string | null
    keySearch?: string | null
    [key: string]: any
}

export type Page<T> = {
    content: T[]
    totalPage: number
    currentPage: number
    pageSize: number
    totalElement: number
    last?: boolean
}
export type PayLoad<T> = {
    code: number
    status: string
    message: string
    data: T
}
export class ErrorPayload extends Error {
    code: number
    status: string
    message: string
    data: any

    constructor(payload: PayLoad<any>) {
        super(payload.data ?? payload.message ?? 'unknown error')
        this.code = payload.code as number
        this.status = payload.status as string
        this.message = payload.message as string
        this.data = payload.data
    }
}

export class HttpClient {
    private instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL + '/api',
            headers: { 'Content-Type': 'application/json; charset=UTF-8', ...this.getHeader() },
            withCredentials: true,
        })

        this.initializeRequestInterceptor()
        this.initializeResponseInterceptor()
    }

    private getHeader(): AxiosHeaders {
        const headers = new AxiosHeaders()

        const authToken = accessToken.get()
        const clientID = clientId.get()

        if (authToken) headers.set('authorization', authToken)
        if (clientID) headers.set('x-client-id', clientID)

        return headers
    }

    private initializeRequestInterceptor() {
        this.instance.interceptors.request.use((config) => {
            config.headers = new AxiosHeaders({
                ...config.headers,
                ...this.getHeader(),
            })
            return config
        })
    }

    private initializeResponseInterceptor() {
        this.instance.interceptors.response.use(
            (response) => {
                console.log(
                    `[${response.status}]`,
                    response.request.responseURL,
                    response.statusText
                )
                console.log('response', response)

                return response.data
            },
            (error: AxiosError) => {
                console.error('error from axios', error)

                if (error.response) {
                    // Server returned an error response (4xx or 5xx)

                    const { data, status } = error.response.data as AxiosResponse<PayLoad<any>>
                    throw new ErrorPayload({
                        code: status,
                        status: 'error',
                        message: data?.message ?? 'Unknown error occurred',
                        data: data?.data || null,
                    })
                } else if (error.request) {
                    // Request was made but no response received (e.g., network error)
                    throw new ErrorPayload({
                        code: 0,
                        status: 'error',
                        message: 'Network error',
                        data: null,
                    })
                } else {
                    // Something else happened while setting up the request
                    throw new ErrorPayload({
                        code: -1,
                        status: 'error',
                        message: error.message ?? 'Unknown error occurred',
                        data: null,
                    })
                }
            }
        )
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.get<T>(url, config)

        return response.data
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.post<T>(url, data, config)
        // //neu url la login thi luu token vao localstorage
        // if (url === '/auth/login' || url === '/auth/register') {
        //     const auth: Auth = response.data as Auth
        //     console.log('login ok', auth)

        //     clientId.set(auth.user.id)
        //     accessToken.set(auth.token.accessToken)
        //     refreshTokenStorage.set(auth.token.refreshToken)
        // }

        return response.data
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.put<T>(url, data, config)
        return response.data
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.delete<T>(url, config)
        return response.data
    }
    // Bạn có thể thêm các phương thức tùy chỉnh khác tại đây nếu cần
}

const http = new HttpClient()

export default http
