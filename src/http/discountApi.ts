import { DiscountPriceType, DiscountState } from '@/utils/constants'
import http, { Page, ParamsRequest } from './http'
import { User } from './authApi'
import { Moment } from 'moment'

export type DiscountParams = ParamsRequest & {
    isExpired?: boolean
    isActive?: boolean
    isNotYetActive?: boolean
    isDeleted?: boolean
}

export type DiscountRequest = {
    id?: string
    name: string
    code: string
    type: keyof typeof DiscountPriceType
    value: number
    totalCount: number
    minOrderValue: number
    countUserUseDiscount: number
    status: boolean
    isDeleted: boolean
    dateStart: string | Date | Moment
    dateEnd: string | Date | Moment
}
export type Discount = {
    id: string
    shop: User
    name: string
    code: string
    type: keyof typeof DiscountPriceType
    value: number
    totalCount: number
    currentCount: number
    minOrderValue: number
    userUsedIds: string[]
    countUserUseDiscount: number
    status: boolean
    isDeleted: boolean
    dateStart: string
    dateEnd: string
    state: keyof typeof DiscountState
}

const discountApi = {
    get: async (params?: ParamsRequest) => await http.get<Page<Discount>>('/discount', { params }),

    getDiscountById: async (id: string) => await http.get<Discount>(`/discount/${id}`),

    addDiscount: async (data: DiscountRequest) => await http.post('/discount', data),

    updateDiscount: async (data: DiscountRequest) => await http.post(`/discount/${data.id}`, data),
}

export default discountApi
