import http, { Page, ParamsRequest } from './http'

export type Sale = {
    id: string
    name: string
    productIds: string[]
    type: string
    value: number
    dateStart: string
    dateEnd: string
    state: string
}

const saleApi = {
    getAll: async (params: ParamsRequest) => await http.get<Page<Sale>>('/sale', { params }),
    addSale: async (sale: Sale) => await http.post('/sale', sale),
    updateSale: async (id: string, sale: Sale[]) => await http.post(`/sale/${id}`, sale),
}

export default saleApi
