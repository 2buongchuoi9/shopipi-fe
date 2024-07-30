import { OrderPayment, OrderShipping, OrderState } from '@/utils/constants'
import { User } from './authApi'
import { CartRequest, ShopOrderItem } from './cartApi'
import http, { Page, ParamsRequest } from './http'

export type ShopOrderItemsRequest = {
    shopId: string
    discountId: string | null
    items: CartRequest[]
}

export type OrderRequest = {
    shopOrderItems: ShopOrderItemsRequest[]
    address: string
    shippingType: keyof typeof OrderShipping
    payment: keyof typeof OrderPayment
}

export type Order = {
    id: string
    user: User
    shippingAddress: string
    shippingType: string
    totalOrder: number
    totalShipping: number
    totalDiscount: number
    totalCheckout: number
    capital: number
    revenue: number
    profit: number
    items: ShopOrderItem[]
    payment: keyof typeof OrderPayment
    state: keyof typeof OrderState
    notes: string[]
    createdAt: string
    updatedAt: string
}

const orderApi = {
    checkoutReview: (data: OrderRequest) => http.post<Order>('/order/checkout-review', data),

    checkoutReviewGuest: (userId: string, data: OrderRequest) =>
        http.post<Order>(`/order/checkout-review-guest/${userId}`, data),

    orderByUser: (data: OrderRequest) => http.post<Order[]>(`/order/order-by-user`, data),

    orderByUser_redirectPayment: (data: OrderRequest, urlRedirect: string) =>
        http.post<{ url: string }>(`/order/order-by-user?urlRedirect=${urlRedirect}`, data),

    get: async (params?: ParamsRequest) =>
        await http.get<Page<Order>>('/order', { params: params }),

    updateStateByShop: async (orderId: string, state: string) =>
        http.post<Order>(`/order/update-state-by-shop/${orderId}?state=${state}`),
}

export default orderApi
