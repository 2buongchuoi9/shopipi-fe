import cartApi, { Cart, CartRequest, ShopOrderItem } from '@/http/cartApi'

import { ReactNode, createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ErrorPayload } from '@/http'
import authApi from '@/http/authApi'
import { useAuth } from '@/hooks'
import orderApi, { Order, OrderRequest, ShopOrderItemsRequest } from '@/http/OrderApi'

type Total = {
    totalItem: number
    totalQuantity: number
}

const getTotalQuantityAndItemCount = (shopOrderItems: ShopOrderItem[]): Total => {
    return shopOrderItems.reduce(
        (acc, orderItem) => {
            const itemCount = orderItem.items.length
            const totalQuantity = orderItem.items.reduce((sum, item) => sum + item.quantity, 0)

            acc.totalItem += itemCount
            acc.totalQuantity += totalQuantity

            return acc
        },
        { totalItem: 0, totalQuantity: 0 }
    )
}

export interface CartContextType {
    // cart
    cart: Cart | null
    totalItem: number
    totalQuantity: number
    fetchCart: () => Promise<void>
    addToCart: (data: CartRequest) => Promise<void>

    // checkout review
    resultCheckoutReview: Order | null

    // request checkout review -> order
    setOrderRequest: (orderRequest: OrderRequest | null) => void
}

export const CartContext = createContext<CartContextType>({} as CartContextType)

export default function CartProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, fetchUser } = useAuth()
    const [cart, setCart] = useState<Cart | null>(null)
    const [total, setTotal] = useState<Total>({ totalItem: 0, totalQuantity: 0 })
    const [resultCheckoutReview, setResultCheckoutReview] = useState<Order | null>(null)
    const [orderRequest, setOrderRequest] = useState<OrderRequest | null>(null)

    const addToCart = async (data: CartRequest) => {
        try {
            const res = await cartApi.addToCart(data)
            setCart(res)
        } catch (error) {
            console.log('Failed to add to cart', error)
        }
    }

    // cart thay đổi -> cập nhật total
    useEffect(() => {
        if (cart) {
            const total = getTotalQuantityAndItemCount(cart.shopOrderItems)
            setTotal(total)
        }
    }, [cart])

    const fetchCart = async () => {
        if (!isAuthenticated) await fetchUser()

        try {
            const res = await cartApi.getCart()
            setCart(res)

            // console.log('load cart', cart)
        } catch (e) {
            if (e instanceof ErrorPayload && e.code === 401) {
                console.log('Failed to fetch cart from context', e)
                setCart(null)
            } else {
                const userMod = await authApi.registerUserMod()
                console.log('register user mod', userMod)

                const res = await cartApi.getCartByUserId(userMod.id)
                console.log('load cart by guest', res)

                setCart(res)
            }
        }
    }

    // request checkout review thay đổi -> call api lấy kết quả checkout review (order)
    // cập nhật resultCheckoutReview
    useEffect(() => {
        ;(async () => {
            if (orderRequest) {
                try {
                    const res = await orderApi.checkoutReview(orderRequest)
                    setResultCheckoutReview(res)
                } catch (e) {
                    console.log('Failed to get checkout review', e)
                }
            } else {
                setResultCheckoutReview(null)
            }
        })()
    }, [orderRequest])

    useLayoutEffect(() => {
        ;(async () => await fetchCart())()
    }, [])

    return (
        <CartContext.Provider
            value={{
                ...total,
                cart,
                fetchCart,
                addToCart,

                resultCheckoutReview,

                setOrderRequest,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
