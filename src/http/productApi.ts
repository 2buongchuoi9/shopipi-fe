import { ProductState } from '@/utils/constants'
import { Category } from './categoryApi'
import http, { Page, ParamsRequest } from './http'
import { Sale } from './saleApi'
import { User } from './authApi'

export const initialProduct: Product = {
    id: '',
    name: '',
    slug: '',
    thumb: '',
    video: '',
    images: [''],
    type: 'CLOTHING',
    sale: null,
    description: '',
    quantity: 0,
    ratingAvg: 0.0,
    totalRating: 0,
    totalComment: 0,
    state: 'HIDDEN',
    isDeleted: false,
    sold: 0,
    attribute: {
        brand: '',
        origin: '',
        listVariant: [{ key: '', values: [''] }],
    },
    variants: [
        {
            id: '',
            productId: '',
            quantity: 0,
            price: 0,
            priceImport: 0,
            priceSale: 0,
            sold: 0,
            valueVariant: [{ key: '', value: '' }],
        },
    ],
    category: {
        id: '',
        slug: '',
        name: '',
        parentIds: [],
        thumb: '',
        children: [],
        key: '',
        label: '',
        value: '',
    },
    createdAt: '',
    shop: {
        id: '',
        name: '',
        email: '',
        image: null,
        status: true,
        verify: false,
        authType: 'LOCAL',
        roles: ['USER'],
        addressShipping: '',
        createdAt: '',
        oauth2Id: null,
        phone: '',
        followers: [],
        slug: '',
        address: [],
    },
}

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
    price: number
    priceImport: number
    priceSale: number
    valueVariant: Map[]
    sold: number
}

export const productType = ['CLOTHING', 'ELECTRONIC', 'OTHER'] as const

export type ProductType = (typeof productType)[number]

export type AttributeBase = {
    type?: string | null
    brand?: string | null
    origin?: string | null
    listVariant: ListMap[] | []
    listAttribute?: Map[] | []
}
export type ElectronicAttr = AttributeBase & {
    manufacturer?: string | null // nha may san xuat
    model?: string | null
    type?: string | null
}

export type ClothingAttr = AttributeBase & {
    material?: string | null
    model?: string | null
    season?: string | null
    style?: string | null
}

export type Attribute = ElectronicAttr | ClothingAttr

export type Product = {
    id: string
    name: string
    slug: string | null
    thumb: string
    video: string | null
    images: string[]

    price?: number // thêm vào
    priceSale?: number // thêm vào
    discount?: number | string // thêm vào
    sale: Sale | null

    type: ProductType
    quantity: number
    description: string
    ratingAvg: number
    totalRating: number
    totalComment: number
    state: keyof typeof ProductState
    attribute: Attribute
    variants: Variant[]
    category: Category
    createdAt: string // Consider using Date if possible
    shop: User
    isDeleted: boolean
    sold: number
}

export type ProductRequest = {
    id?: string
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
    state: keyof typeof ProductState

    // thuộc tính này không cần gưi lên server
    isHidden?: boolean
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
    getAll: async (params?: ParamsRequest) =>
        await http.get<Page<Product>>('/product', { params: params }),

    addProduct: async (data: ProductRequest) => await http.post<Product>('/product', data),

    updateProduct: async (id: string, data: ProductRequest) =>
        await http.post<Product>(`/product/${id}`, data),

    findBySlug: async (slug: string) => await http.get<Product>(`/product/slug/${slug}`),

    findById: async (id: string) => await http.get<Product>(`/product/id/${id}`),

    updateManyState: async (ids: string[], state: keyof typeof ProductState) =>
        await http.post<boolean>(`/product/update-many-state`, { ids, value: state }),

    deleteProduct: async (id: string) => await http.delete<boolean>(`/product/${id}`),

    countProduct: async (shopId: string) => {
        const res = await http.get<number[]>(`/product/count/${shopId}`)
        console.log('res', res)

        return {
            countProduct: res[0],
            countVariant: res[1],
            countSold: res[2],
        }
    },
}
export default productApi
