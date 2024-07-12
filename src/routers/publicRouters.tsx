import { DefaultLayout } from '@/layouts'
import { ProductDetail, ProductPage } from '@/pages/product'
import { ComponentType, ReactNode } from 'react'
import { CartPage } from '@/pages/cart'
import { HomePage } from '@/pages/home'
import { OrderPage } from '@/pages/order'
import { Login, Redirect, Register } from '@/pages/auth'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path,
        component,
        layout: layout ?? DefaultLayout,
    }
}

const publicRouters = [
    route('/', HomePage),

    route('/login-redirect', Redirect),
    route('/login', Login),
    route('/register', Register),

    route('/product', ProductPage),
    route('/product/:slug', ProductDetail),

    route('/cart', CartPage),

    route('/order', OrderPage),
]

export default publicRouters
