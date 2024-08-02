import { User } from './authApi'
import http, { Page, ParamsRequest } from './http'
import { Product } from './productApi'
import { Shop } from './shopApi'

export type ResultSearch = {
    shops: Page<Shop>
    products: Page<Product>
}

const searchApi = {
    search: async (params: ParamsRequest) => await http.get<ResultSearch>('/search', { params }),
}

export default searchApi
