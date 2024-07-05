import http from './http'

export type Category = {
    id: string
    slug: string
    name: string
    parentId: string | null
    thumb: string
    parentName: string | null
}

const categoryApi = {
    get: async () => await http.get<Category[]>('/category'),
}

export default categoryApi
