import http from './http'

export type Brand = {
    id: string
    name: string
}

const brandApi = {
    get: async (keySearch?: string) =>
        keySearch
            ? await http.get<Brand[]>(`/brands?keySearch=${keySearch}`)
            : await http.get<Brand[]>('/brands'),

    add: async (brand: Brand) => await http.post<Brand>('/brands', brand),
}
export default brandApi
