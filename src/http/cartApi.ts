import http from './http'
import { Product, Variant } from './productApi'

export type CartItem = {
    product: Product
    variant: Variant
    quantity: number
    price: number
}

export type ShopOrderItem = {
    shopId: string
    discountId: string
    items: CartItem[]
    totalDiscount: number
    total: number
}

export type Cart = {
    id: string
    userId: string
    shopOrderItems: ShopOrderItem[]
    totalDiscount: number
    total: number
}

export type CartRequest = {
    productId: string
    variantId: string
    quantity: number
}

const cartApi = {
    getCart: () => http.post<Cart>('/cart'),
    addToCart: (data: CartRequest) => http.post<Cart>('/cart/add-to-cart', data),

    getCartByUserId: (userId: string) => http.get<Cart>(`/cart/${userId}`),

    addToCartGuest: (data: CartRequest, userId: string) =>
        http.post<Cart>(`/cart/add-to-cart/by-user-mod/${userId}`, data),
}
export default cartApi
