import { DiscountPriceType, DiscountState } from '@/utils/constants'
import http, { Page, ParamsRequest } from './http'
import { Moment } from 'moment'

export type Sale = {
    id: string
    name: string
    shopId: string
    productIds: string[]
    type: keyof typeof DiscountPriceType
    value: number
    dateStart: string
    dateEnd: string
    state: keyof typeof DiscountState
}
export type SaleRequest = {
    id?: string
    name: string
    shopId: string
    productIds: string[] | []
    type: keyof typeof DiscountPriceType
    value: number
    dateStart: string | Date | Moment
    dateEnd: string | Date | Moment
    state?: keyof typeof DiscountState
}

const saleApi = {
    getAll: async (params: ParamsRequest) => await http.get<Page<Sale>>('/sale', { params }),
    getById: async (id: string) => await http.get<Sale>(`/sale/${id}`),
    addSale: async (sale: SaleRequest) => await http.post('/sale', sale),
    updateSale: async (id: string, sale: SaleRequest) => await http.post(`/sale/${id}`, sale),

    deleteSale: async (id: string) => await http.delete<boolean>(`/sale/${id}`),
}

export default saleApi
