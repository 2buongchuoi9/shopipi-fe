import { add } from 'lodash'
import http from './http'

export type Category = {
    id: string
    slug: string
    name: string
    parentIds: string[]
    thumb: string
    key: string
    label: string
    value: string | number
    children: Category[]
}

const categoryApi = {
    get: async () => await http.get<Category[]>('/category'),

    getBySlug: async (slug: string) => await http.get<Category>(`/category/${slug}`),

    addCategory: async (category: Category) => await http.post<Category>('/category', category),

    updateCategory: async (id: string, category: Category) =>
        await http.post<Category>(`/category/${id}`, category),

    deleteCategory: async (slug: string) => await http.delete(`/category/${slug}`),
}

export default categoryApi
