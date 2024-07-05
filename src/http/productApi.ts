import { Category } from './categoryApi'
import http, { Page } from './http'
import { Shop } from './shopApi'

export type Map = {
    key: string
    value: string
}

export type ListMap = {
    key: string
    values: string[]
}

export type Variant = {
    id: string
    productId: string
    quantity: number
    valueVariant: Map[]
}

export const productType = ['CLOTHING', 'ELECTRONIC', 'OTHER'] as const

export type ProductType = (typeof productType)[number]

export type AttributeBase = {
    type?: string | null
    brand: string | null
    origin: string | null
    listVariant: ListMap[] | []
}
export type ElectronicAttr = AttributeBase & {
    manufacturer: string | null // nha may san xuat
    model: string | null
    type: string | null
}

export type ClothingAttr = AttributeBase & {
    material: string | null
    model: string | null
    season: string | null
    style: string | null
}

export type Attribute = ElectronicAttr | ClothingAttr

export type Product = {
    id: string
    name: string
    slug: string | null
    thumb: string
    video: string | null
    images: string[]
    price: number
    priceImport: number
    type: ProductType
    quantity: number
    description: string
    ratingAvg: number
    totalRating: number
    totalComment: number
    status: boolean
    attribute: Attribute
    variants: Variant[]
    category: Category
    createAt: string // Consider using Date if possible
    shop: Shop
}

export type ProductRequest = {
    attribute: Attribute
    type: ProductType | null
    name: string | null
    thumb: string | null
    video: string | null
    images: string[] | []
    price: number | 0
    priceImport: number | 0
    description: string | null
    categoryId: string | null
    status: boolean
}

export const isElectronicAttr = (attr: Attribute): attr is ElectronicAttr => {
    const a = attr as ElectronicAttr
    return a.manufacturer !== undefined && a.model !== undefined && a.type !== undefined
}

export const isClothingAttr = (attr: Attribute): attr is ClothingAttr => {
    const a = attr as ClothingAttr
    return (
        a.material !== undefined &&
        a.model !== undefined &&
        a.season !== undefined &&
        a.style !== undefined
    )
}

const productApi = {
    getAll: async () => await http.get<Page<Product>>('/product'),
    addProduct: async (data: ProductRequest) => await http.post<Product>('/product', data),
    findBySlug: async (slug: string) => await http.get<Product>(`/product/slug/${slug}`),
}
export default productApi
