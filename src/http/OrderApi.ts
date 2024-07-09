import { User } from './authApi'
import { CartRequest, ShopOrderItem } from './cartApi'
import http from './http'

export type ShopOrderItemsRequest = {
    shopId: string
    discountId: string | null
    items: CartRequest[]
}

export type OrderRequest = {
    shopOrderItems: ShopOrderItemsRequest[]
    address: string
    payment: 'CASH' | 'MOMO' | 'CARD_BANK'
}

export type Order = {
    id: string
    user: User
    shippingAddress: string
    totalOrder: number
    totalShipping: number
    totalDiscount: number
    totalCheckout: number
    capital: number
    revenue: number
    profit: number
    items: ShopOrderItem[]
    payment: string
    state: string
    note: string
    createAt: string
    updateAt: string
}

const orderApi = {
    checkoutReview: (data: OrderRequest) => http.post<Order>('/order/checkout-review', data),
}

export default orderApi
